// process.env.RAILS_ENV is replaced at compile time by esbuild (see configs/esbuild.config.js)
/* global process */

/**
  * All view components will be wrapped in this element.
 *
 * Attributes on this element are used to provide auto-initialization for
 * Stimulus controllers and a unique CSS class to target component styles.
 * It also provides a hook for us to add shared logging, etc. in the future.
 */

/**
 * Rewrite `controller` placeholder attributes and action values in a cloned HTML string,
 * replacing them with the real Stimulus identifier.
 *
 * Use this when inserting <template> content at runtime — template fragment children live in
 * `template.content` (a DocumentFragment outside the regular DOM tree), so ts-wrapper's hydration
 * traversal never enters them and any `controller` placeholders survive verbatim into cloned chunks.
 *
 * Example:
 *   const html = Teamshares.tsWrapper.rewriteCloned(this.rowTemplateTarget.innerHTML, this.identifier);
 *   this.listTarget.insertAdjacentHTML("beforeend", html);
 *
 * Note: the bare `controller#action` shorthand (without a preceding `->`) is not rewritten here
 * because template contexts are action-descriptor strings, not standalone prefixes.
 */
export function rewriteCloned (html, identifier) {
  return html
    .replaceAll("->controller#", `->${identifier}#`)
    .replaceAll(/data-controller-([a-z0-9-]+)/g, `data-${identifier}-$1`);
}

class TsWrapper extends HTMLElement {
  connectedCallback () {
    let topLevelElement;

    if (this.children.length === 1) {
      /**
       * If the VC has a single root node, use that as the top level element, keeping its attributes,
       * including any additional controllers
       */
      topLevelElement = this.children[0];
    } else {
      /**
       * If the VC has multiple children at the top level, create a wrapper div
       * and re-parent the children inside it. (Note that all of this will still only happen
       * if the wrapper functionality is enabled from the ViewComponent class.)
       */
      topLevelElement = document.createElement("div");
      topLevelElement.append(...this.children);
    }

    /** Add the generated controller to the top level, along with any existing controllers */
    /** Note: existing controllers will only be migrated upward if there's an existing single root node to start with */
    const controller = this.getAttribute("data-controller");
    const wrappedController = topLevelElement.getAttribute("data-controller");
    topLevelElement.setAttribute("data-controller", wrappedController ? `${controller} ${wrappedController}` : controller);

    /** Find generic data-action attributes and inject the controller name */
    this.replaceDataAttributes(topLevelElement, controller);

    /**
     * Hoist any Stimulus *-value attributes that landed on a descendant of the mount up to the
     * mount itself — Stimulus reads static values only from this.element (the controller root),
     * so a value attribute on a descendant always silently falls back to the type default.
     *
     * Throws in dev/test when a conflict cannot be auto-resolved (the mount already has the same
     * attribute with a different value, meaning two parts of the template disagree). In production,
     * the mount value wins and the stray descendant copy is silently dropped.
     */
    this.hoistOrphanedValues(topLevelElement, controller);

    /** Add the generated class as the first in the list */
    topLevelElement.classList = `${this.className} ${topLevelElement.classList}`;

    /** Re-parent the top-level element and remove the ts-wrapper element from the DOM */
    // parentNode can be null when Turbo connects elements into a detached subtree during
    // frame rendering (e.g. Bardo's preservingPermanentElements). Safe to bail out: the
    // element is not in the document so there is nothing to unwrap.
    if (!this.parentNode) return;
    this.parentNode.insertBefore(topLevelElement, this);
    this.remove();
  }

  /**
   * Iterate through the Stimulus data- values (targets, actions, values, outlets)
   * and replace "controller" with the generated controller name.
   */
  replaceDataAttributes (rootNode, controller) {
    function traverse (node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.hasAttributes()) {
        /** We need a copy because if we iterate through the attrs directly, the length keeps growing as we change the names */
        const originalAttributes = [];
        for (const attr of node.attributes) {
          if (attr.specified && attr.name.startsWith("data-")) {
            originalAttributes.push(attr);
          }
        }
        for (let i = 0; i < originalAttributes.length; i++) {
          const attr = originalAttributes[i];
          // console.log(attr.name + " = " + attr.value);
          const originalName = attr.name;
          /** Match data-controller-target, data-controller-[something]-value, data-controller-[something]-param, and data-controller-[something]-outlet */
          const name = attr.name.replace("-controller-", `-${controller}-`);
          /** Match all data-action values "event->controller#action" */
          let value = attr.value.replaceAll("->controller#", `->${controller}#`);
          /** Match the shorthand, data-action="controller#action" */
          if (value.startsWith("controller#")) {
            value = value.replace("controller#", `${controller}#`);
          }
          // console.log("   -> ", name + " = " + value);
          node.setAttribute(name, value);
          if (name !== originalName) {
            /** Original attribute is now stale, so remove it. */
            node.removeAttribute(originalName);
          }
        }
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        // Once we hit a child node with a <ts-wrapper>, stop traversing, since that node will have its own controller
        if (node.nodeName !== "TS-WRAPPER") {
          traverse(node.childNodes[i]);
        }
      }
    }
    traverse(rootNode);
  }

  /**
   * Move any `data-<controller>-*-value` attributes from descendants of the mount up to the
   * mount element itself. Stimulus reads `static values` only from `this.element` (the controller
   * root); the existing rewrite traversal correctly renames the attribute but cannot move it.
   *
   * Clean hoists (single occurrence, no pre-existing mount copy): always performed in all envs.
   * Conflicts (mount already has the attribute with a different value, or two descendants disagree):
   *   - dev/test  → throw with a descriptive message so the bug is surfaced at hydration.
   *   - production → mount value wins; duplicate is silently dropped (deterministic, no throw).
   *
   * Nested <ts-wrapper> subtrees are skipped — they own their own controller identifier and value
   * attributes; their presence cannot produce a conflict with ours.
   */
  hoistOrphanedValues (mount, controller) {
    const prefix = `data-${controller}-`;
    const isValue = (name) => name.startsWith(prefix) && name.endsWith("-value");
    // process.env.RAILS_ENV is a compile-time constant (esbuild define) — using it here avoids
    // a timing issue where connectedCallback fires (when customElements.define upgrades existing
    // elements) before window.Teamshares is set, which happens later in index.js evaluation.
    const devMode = process.env.RAILS_ENV !== "production";

    const walk = (node) => {
      for (const child of node.children) {
        if (child.nodeName === "TS-WRAPPER") continue; // nested component owns its own values

        // Snapshot attribute names first — mutating attributes while iterating the live NamedNodeMap
        // changes the collection length and skips entries.
        const names = [];
        for (const attr of child.attributes) {
          if (isValue(attr.name)) names.push(attr.name);
        }

        for (const name of names) {
          const value = child.getAttribute(name);
          if (mount.hasAttribute(name)) {
            // The mount already carries this value (either set in the template markup directly, or
            // hoisted here from an earlier descendant). If the values differ it's an author error.
            if (devMode && mount.getAttribute(name) !== value) {
              throw new Error(
                `ts-wrapper: "${name}" is set on both the "${controller}" controller mount ` +
                `("${mount.getAttribute(name)}") and a <${child.nodeName.toLowerCase()}> descendant ` +
                `("${value}"). Stimulus reads static values only from the mount — remove the duplicate.`,
              );
            }
            child.removeAttribute(name); // prod / identical values: mount wins, drop the stray copy
          } else {
            mount.setAttribute(name, value); // clean hoist
            child.removeAttribute(name);
          }
        }

        walk(child);
      }
    };
    walk(mount);
  }
}

customElements.define("ts-wrapper", TsWrapper);
