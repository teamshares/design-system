import { Application } from "@hotwired/stimulus";

// Shared controllers
import ToggleController from "./toggle_controller";

const registerStimulusControllers = (appDefinitions) => {
  const application = Application.start();

  // Register the shared controllers
  application.register("toggle", ToggleController);

  // Auto-load all app controllers
  application.load(appDefinitions);

  // Configure Stimulus development experience
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  return application;
};

export { registerStimulusControllers };
