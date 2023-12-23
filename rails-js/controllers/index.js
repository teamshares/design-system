import { Application } from "@hotwired/stimulus";

// Shared controllers
import ToggleController from "./toggle_controller";

const appComponentControllersGlob = require("@app/components/**/controller.js");
const appControllersGlob = require("@app/javascript/controllers/**/*_controller.js");
const sharedComponentControllersGlob = require("@teamshares-rails/components/**/controller.js");

// NOTE: we could move the shared stimulus controllers in design-system back into teamshares_rails too,
// but we haven't figured out how to manage any JS dependencies that might be needed by those controllers.
// const sharedControllersGlob = require("@app/javascript/controllers/**.js");

const pathToComponentControllerIdentifier = (path) => path.match(/\/(components\/.+)\/controller\.js$/)[1];
const pathToStimulusControllerIdentifier = (path) => path.match(/\/controllers\/(.+)(_controller)?\.js$/)[1].replace("_controller", "");

// Parse the output of the glob (from esbuild-plugin-import-glob) and register the controllers
const _registerControllersFromGlob = (application, glob, baseExtractorFn) => {
  if (!glob) return;

  glob.default.forEach(({ default: controller }, idx) => {
    const path = glob.filenames[idx];
    const name = baseExtractorFn(path).replaceAll("/", "--").replaceAll("_", "-");

    if (name !== "application") application.register(name, controller);
  });
};

const registerStimulusControllers = () => {
  const application = Application.start();

  // Register the shared controllers
  application.register("toggle", ToggleController);

  // Auto-load all shared component controllers
  _registerControllersFromGlob(application, sharedComponentControllersGlob, pathToComponentControllerIdentifier);

  // Auto-load all app controllers
  _registerControllersFromGlob(application, appControllersGlob, pathToStimulusControllerIdentifier);

  // Auto-load all app component controllers
  _registerControllersFromGlob(application, appComponentControllersGlob, pathToComponentControllerIdentifier);

  // Configure Stimulus development experience
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  return application;
};

export { registerStimulusControllers };
