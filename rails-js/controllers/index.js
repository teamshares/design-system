import { Application } from "@hotwired/stimulus";

// Shared controllers
import ToggleController from "./toggle_controller";

// Convert path into a controller identifier:
//   components/example/controller.js -> example
//   components/nav/user_info/controller.js -> nav--user-info
const pathToComponentControllerIdentifier = (path) => path.match(/\/(components\/.+)\/controller\.js$/)[1]
  .replaceAll("/", "--")
  .replaceAll("_", "-");

// Parse the output of the glob (from esbuild-plugin-import-glob) and register the controllers
const registerComponentStimulusControllersFromGlob = (application, glob) => {
  if (!glob) return;

  glob.default.forEach(({ default: controller }, idx) => {
    const path = glob.filenames[idx];
    const name = pathToComponentControllerIdentifier(path);
    application.register(name, controller);
  });
};

const registerStimulusControllers = (appControllers, componentControllersGlob) => {
  const application = Application.start();

  // Register the shared controllers
  application.register("toggle", ToggleController);

  // Auto-load all app controllers
  application.load(appControllers);

  // Auto-load all app component controllers
  registerComponentStimulusControllersFromGlob(application, componentControllersGlob);

  // Configure Stimulus development experience
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  return application;
};

export { registerStimulusControllers };
