import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["toggleable"];
  static classes = ["toggle"];

  connect () {
    this.element[this.identifier] = this;
    this.classToToggle = this.hasToggleClass ? this.toggleClass : "hidden";
    this.externalTargets = document.getElementsByClassName(this.data.get("externalTargetClass"));
  }

  classIsApplied () {
    return this.element.classList.contains(this.classToToggle);
  }

  toggle (event) {
    if (!this.data.has("allowDefault")) event.preventDefault();

    this.toggleControllerTargets();
    this.toggleExternalTargets();
  }

  toggleOff (event) {
    if (!this.data.has("allowDefault")) event.preventDefault();

    if (this.classIsApplied()) this.toggle(event);
  }

  toggleControllerTargets () {
    this.toggleableTargets.forEach(target => {
      this.toggleElementClassList(target);
    });
  }

  toggleExternalTargets () {
    for (let i = 0; i < this.externalTargets.length; ++i) {
      this.toggleElementClassList(this.externalTargets[i]);
    }
  }

  toggleElementClassList (targetElement) {
    targetElement.classList.toggle(this.classToToggle);
  }
}
