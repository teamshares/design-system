import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  show (event) {
    const target = this.getTarget(event, this);
    this.dispatch("show", { detail: { target, originalEvent: event } });
    this.perform(event, "show", target);
  };

  hide (event) {
    const target = this.getTarget(event, this);
    this.dispatch("hide", { detail: { target, originalEvent: event } });
    this.perform(event, "hide", target);
  };

  /** Empty event handler so callers can short-circuit a launch action on a parent element */
  doNothing (event) {
    if (Teamshares.isDev) {
      console.log("launcher#doNothing", event);
    }
  }

  getTarget (event, emitter) {
    const target = event.params.target;
    if (!target) {
      if (Teamshares.isDev) {
        console.error(`No data-launcher-target-param set on ${emitter}`);
      }
      return false;
    } else {
      return target;
    }
  }

  perform = (event, action, targetId) => {
    // console.log("launcher#action", action, event, targetId);
    if (event.propagationStopped) {
      console.log(`Propagation stopped on event ${event}. Exiting launch.`);
      return;
    }

    const targetRootId = this.element.dataset.launcherParent;
    const targetRoot = document.getElementById(targetRootId) || document;
    const launchable = targetRoot.getElementById(targetId);

    if (!launchable) {
      if (Teamshares.isDev) {
        console.error(`No launchable element with id "${targetId}" found.`);
      }
      return;
    }

    if (typeof launchable[action] === "function") {
      launchable[action]();
    } else {
      if (Teamshares.isDev) {
        console.error(`${targetId}.${action}() is not a function.`);
      }
    }
  };
}
