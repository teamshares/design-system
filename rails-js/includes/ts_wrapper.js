// All view components will be wrapped in this element.
//
// Attributes on this element are used to provide auto-initialization for
// Stimulus controllers and a unique CSS class to target component styles.
// It also provides a hook for us to add shared logging, etc. in the future.
class TsWrapper extends HTMLElement {
  connectedCallback () {
    // Get the top-level element of the ViewComponent (or the first child).
    const wrapped = this.children[0];

    if (wrapped) {
      // If the child has passed along classes for the wrapper, apply them.
      const classes = wrapped.getAttribute("data-wrapper-classes");
      if (classes) {
        this.classList.add(...classes.split(" "));
      }

      // If hoist is true, lift the classes off the child and apply them to the wrapper.
      // Note that hoist and wrapper-classes are not mutually-exclusive.
      const hoist = wrapped.getAttribute("data-wrapper-hoist");
      if (hoist !== "false" && hoist !== null) {
        // To apply the child classes, we first give the wrapper a block context
        // rather than its default of `display: contents`.
        // This can be overridden by child classes like `.flex`.
        this.style.display = "block";
        this.classList.add(...wrapped.classList);
      }
    }
  }
}

customElements.define("ts-wrapper", TsWrapper);
