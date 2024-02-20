import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  show = () => {
    const triggerTargetId = this.element.dataset.triggerTargetId;
    const targetRootId = this.element.dataset.triggerParentId;
    if (!triggerTargetId) {
      console.error(`No data-trigger-target-id set on ${this}`);
    }
    const targetRoot = document.getElementById(targetRootId) || document;
    const triggerable = targetRoot.getElementById(triggerTargetId);
    if (!triggerable) {
      console.error(`No triggerable element with id "${triggerTargetId}" found.`);
    }
    if (typeof triggerable.show === "function") {
      triggerable.show();
    } else {
      console.error(`${triggerTargetId}.show() is not a function.`);
    }
  };
}
