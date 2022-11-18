import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["switchable", "clickable"];

  // TODO: hardcoded to work with /for-leaders page - switch to using Values to customize active/inactive classes

  connect () {
    this.element[this.identifier] = this;
  }

  switch (event) {
    if (!this.data.has("allowDefault")) {
      event.preventDefault();
    }

    this.deactivate();
    this.activate(event.target);
  }

  deactivate () {
    this.switchableTargets.forEach(target => {
      target.classList.add("hidden");
    });

    this.clickableTargets.forEach(target => {
      target.classList.remove("text-gray-100", "border-gray-100");
      target.classList.add("border-gray-900");
    });
  }

  activate (currentElement) {
    currentElement.classList.remove("border-gray-900");
    currentElement.classList.add("text-gray-100", "border-gray-100");
    document.querySelectorAll(`.${currentElement.id}`).forEach(element => {
      element.classList.remove("hidden");
    });
  }
}
