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
  }
}
