import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  show = () => {
    this.trigger("show");
  };

  hide = () => {
    this.trigger("hide");
  };

  trigger = (action) => {
    const triggerTargetId = this.element.dataset.triggerTarget;
    const targetRootId = this.element.dataset.triggerParent;

    if (!triggerTargetId) {
      console.error(`No data-trigger-target-id set on ${this}`);
      return;
    }

    const targetRoot = document.getElementById(targetRootId) || document;
    const triggerable = targetRoot.getElementById(triggerTargetId);

    if (!triggerable) {
      console.error(`No triggerable element with id "${triggerTargetId}" found.`);
      return;
    }

    if (typeof triggerable[action] === "function") {
      triggerable[action]();
    } else {
      console.error(`${triggerTargetId}.${action}() is not a function.`);
    }
  };
}
