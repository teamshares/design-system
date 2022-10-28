import "./components";
import { registerIconLibrary } from "@shoelace-style/shoelace";
import { initHoneybadger } from "./_honeybadger";

export * from "./controllers";
export * from "./_honeybadger"; // Leaving this for legacy sake; should be removed once everyone is calling initialize below

/** ********************************************************** */
/**  Apps should import Teamshares and call init() on startup  */
/** ********************************************************** */
export default class Teamshares {
  static init = () => {
    initHoneybadger({ debug: true });

    // Registers Heroicons as the default icon library in Shoelace
    registerIconLibrary("default", {
      resolver: name => `https://cdn.jsdelivr.net/npm/heroicons@2.0.1/24/outline/${name}.svg`
    });
  };
};
