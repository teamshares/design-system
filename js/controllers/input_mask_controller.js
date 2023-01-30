import { Controller } from "@hotwired/stimulus";
import Inputmask from "inputmask";

export default class extends Controller {
  connect () {
    Inputmask(this.data.get("pattern")).mask(this.element);
  }
}
