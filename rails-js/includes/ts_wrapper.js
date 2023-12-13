// All view components will be wrapped in this element.
//
// Attributes on this element are used to provide auto-initialization for
// Stimulus controllers and a unique CSS class to target component styles.
// It also provides a hook for us to add shared logging, etc. in the future.
class TsWrapper extends HTMLElement {}
customElements.define("ts-wrapper", TsWrapper);
