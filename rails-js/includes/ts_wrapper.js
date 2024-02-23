// All view components will be wrapped in this element.
//
// Attributes on this element are used to provide auto-initialization for
// Stimulus controllers and a unique CSS class to target component styles.
// It also provides a hook for us to add shared logging, etc. in the future.
class TsWrapper extends HTMLElement {
  connectedCallback () {
    let topLevelElement;

    if (this.children.length === 1) {
      topLevelElement = this.children[0];
    } else {
      // If the VC has multiple children at the top level, create a wrapper div
      // and re-parent the children inside it. (Note that all of this will still only happen
      // if the wrapper functionality is enabled from the ViewComponent class.)
      topLevelElement = document.createElement("div");
      topLevelElement.append(...this.children);
    }

    // Add the generated controller to the top level, along with any existing controllers
    const controller = this.getAttribute("data-controller");
    const wrappedController = topLevelElement.getAttribute("data-controller");
    topLevelElement.setAttribute("data-controller", wrappedController ? `${controller} ${wrappedController}` : controller);

    // Find generic data-action attributes and inject the controller name
    this.replaceDataAttributes(topLevelElement, controller);

    // Add the generated class as the first in the list
    topLevelElement.classList = `${this.className} ${topLevelElement.classList}`;

    // Re-parent the top-level element and remove the ts-wrapper element from the DOM
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
        // We need a copy because if we iterate through the attrs directly, the length keeps growing as we change the names
        const originalAttributes = [];
        for (const attr of node.attributes) {
          if (attr.specified && attr.name.startsWith("data-")) {
            originalAttributes.push(attr);
          }
        }
        for (let i = 0; i < originalAttributes.length; i++) {
          const attr = originalAttributes[i];
          // console.log(attr.name + " = " + attr.value);
          // Matches data-controller-target, data-controller-[something]-value, and data-controller-[something]-outlet
          const name = attr.name.replace("-controller-", `-${controller}-`);
          // Matches only data-action values
          const value = attr.value.replace("->controller#", `->${controller}#`);
          // console.log("   -> ", name + " = " + value);
          node.setAttribute(name, value);
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
}

customElements.define("ts-wrapper", TsWrapper);
