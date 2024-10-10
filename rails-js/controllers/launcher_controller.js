import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  show (event) {
    const target = this.getTarget(event);
    if (target) {
      this.dispatch("show", { detail: { target, originalEvent: event } });
      this.perform(event, "show", target);
    }
  };

  hide (event) {
    const target = this.getTarget(event);
    if (target) {
      this.dispatch("hide", { detail: { target, originalEvent: event } });
      this.perform(event, "hide", target);
    }
  };

  toggle (event) {
    console.log(event);
    const target = this.getTarget(event);
    if (target) {
      const action = target.open ? "hide" : "show";
      this.dispatch("toggle", { detail: { target, action, originalEvent: event } });
      this.perform(event, action, target);
    }
  }

  /** Empty event handler so callers can short-circuit a launch action on a parent element */
  doNothing (event) {
    if (Teamshares.isDev || Teamshares.isTest) {
      console.log("launcher#doNothing", event);
    }
  }

  getTarget (event) {
    const target = event.params.target;
    if (!target) {
      console.log("launcher_controller: No target specified for event.", { event });
      if (Teamshares.isDev || Teamshares.isTest) {
        console.error(`launcher_controller: Trigger element ${event.target.tagName} is missing a data-launcher-target-param.`, { element: event.target });
      }
      return false;
    } else {
      const launchable = document.getElementById(target);
      if (!launchable) {
        if (Teamshares.isDev || Teamshares.isTest) {
          console.error(`launcher_controller: No launchable element with id "${target}" found.`);
        }
        return false;
      }
      return launchable;
    }
  }

  perform = (event, action, launchable) => {
    // console.log("launcher#action", action, event, targetId);
    if (event.propagationStopped) {
      console.log(`launcher_controller: Propagation stopped on event ${event}. Exiting launch.`);
      return;
    }

    if (typeof launchable[action] === "function") {
      launchable[action]();
    } else {
      if (Teamshares.isDev || Teamshares.isTest) {
        console.error(`launcher_controller: ${launchable.id}.${action}() is not a function.`);
      }
    }
  };
}
