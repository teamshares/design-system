import * as Shoelace from "@teamshares/shoelace";
import { initHoneybadger } from "./_honeybadger";

export * from "./controllers";
export * from "./_honeybadger"; // Leaving this for legacy sake; should be removed once everyone is calling initialize below

/** ********************************************************** */
/**  Apps should import Teamshares and call init() on startup  */
/** ********************************************************** */
export default class Teamshares {
  static init () {
    console.log("Initializing Teamshares JS");
    initHoneybadger({ debug: true });

    // Registers Heroicons as the default icon library in Shoelace
    Shoelace.registerIconLibrary("default", {
      resolver: name => `https://cdn.jsdelivr.net/npm/heroicons@2.0.13/24/outline/${name}.svg`,
    });
  }
}
