import { Application } from "@hotwired/stimulus";

// Shared controllers
import ToggleController from "./toggle_controller";
import TriggerController from "./trigger_controller";

const sharedComponentControllersGlob = require("@teamshares-rails/components/**/controller.js");
const appComponentControllersGlob = require("@app/components/**/controller.js");
const appControllersGlob = require("@app/javascript/controllers/**/*_controller.js");

// TODO: this is hardcoding for the health insurance onboarding engine - remove when app is extracted from OS
const tempHealthEngineComponentControllersGlob = require("@health-engine/components/**/controller.js");
const tempHealthEngineControllersGlob = require("@health-engine/javascript/controllers/**/*_controller.js");

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
  application.register("trigger", TriggerController);

  // Auto-load all shared component controllers
  _registerControllersFromGlob(application, sharedComponentControllersGlob, pathToComponentControllerIdentifier);

  // Auto-load all app controllers
  _registerControllersFromGlob(application, appControllersGlob, pathToStimulusControllerIdentifier);
  _registerControllersFromGlob(application, tempHealthEngineControllersGlob, pathToStimulusControllerIdentifier);

  // Auto-load all app component controllers
  _registerControllersFromGlob(application, appComponentControllersGlob, pathToComponentControllerIdentifier);
  _registerControllersFromGlob(application, tempHealthEngineComponentControllersGlob, pathToComponentControllerIdentifier);

  // Configure Stimulus development experience
  application.warnings = true;
  application.debug = false;
  window.Stimulus = application;

  return application;
};

export { registerStimulusControllers };
