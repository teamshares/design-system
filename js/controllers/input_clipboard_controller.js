import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  copy (_event) {
    const clipboardCopyEl = this.element;
    clipboardCopyEl.classList.add("clicked");

    setTimeout(() => {
      clipboardCopyEl.classList.remove("clicked");
    }, 5000);
  }
}
