import * as Shoelace from "@teamshares/shoelace"; // eslint-disable-line no-unused-vars
import { initHoneybadger } from "./_honeybadger";
import Rails from "@rails/ujs";

export * from "./controllers";
export * from "./_honeybadger"; // Leaving this for legacy sake; should be removed once everyone is calling initialize below

/** ********************************************************** */
/**  Apps should import Teamshares and call init() on startup  */
/** ********************************************************** */
export default class Teamshares {
  static init () {
    console.log("Initializing Teamshares JS");
    initHoneybadger({ debug: true });

    // Overwrite Rails UJS's selectors to include Shoelace elements
    Rails.buttonClickSelector = {
      selector: "button[data-remote]:not([form]), button[data-confirm]:not([form]), sl-button[data-remote]:not([form]), sl-button[data-confirm]:not([form])",
      exclude: "form button, form sl-button",
    };
    Rails.linkClickSelector = "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable], sl-button[href][data-confirm], sl-button[href][data-method], sl-button[href][data-remote]:not([disabled]), sl-button[href][data-disable-with], sl-button[href][data-disable]";

    Rails.start();
  }
}
