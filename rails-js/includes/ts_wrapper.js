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

    // Add the generated class as the first in the list
    topLevelElement.classList = `${this.className} ${topLevelElement.classList}`;

    // Re-parent the top-level element and remove the ts-wrapper element from the DOM
    this.parentNode.insertBefore(topLevelElement, this);
    this.remove();
  }
}

customElements.define("ts-wrapper", TsWrapper);
