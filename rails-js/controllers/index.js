import { Application } from "@hotwired/stimulus";

// Shared controllers
import ToggleController from "./toggle_controller";

// Convert path into a controller identifier:
//   components/example/controller.js -> example
//   components/nav/user_info/controller.js -> nav--user-info
const pathToComponentControllerIdentifier = (path) => path.match(/\/(components\/.+)\/controller\.js$/)[1]
  .replaceAll("/", "--")
  .replaceAll("_", "-");

const registerStimulusControllers = (appDefinitions, componentControllers) => {
  const application = Application.start();

  // Register the shared controllers
  application.register("toggle", ToggleController);

  // Auto-load all app controllers
  application.load(appDefinitions);

  // Auto-load all component controllers
  if (componentControllers) {
    componentControllers.default.forEach(({ default: controller }, idx) => {
      const path = componentControllers.filenames[idx];
      const name = pathToComponentControllerIdentifier(path);
      console.log({ path, name, controller });
      application.register(name, controller);
    });
  }

  // Configure Stimulus development experience
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  return application;
};

export { registerStimulusControllers };
