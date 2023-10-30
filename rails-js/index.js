import * as Shoelace from "@teamshares/shoelace";
import Honeybadger from "@honeybadger-io/js";

// Importing this as a default param so the init doesn't break if apps don't pass it in
import Rails from "@rails/ujs";

/** ********************************************************** */
/**  Apps should import Teamshares and call init() on startup  */
/** ********************************************************** */

// The next line tells eslint to accept the undef vars (these are specifically injected into esbuild's build process)
/* global process */
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;
const RAILS_ENV = process.env.RAILS_ENV;
const HONEYBADGER_JS_API_KEY = process.env.HONEYBADGER_JS_API_KEY;
const HEROKU_SLUG_COMMIT = process.env.HEROKU_SLUG_COMMIT;

const _getEnvContext = () => (RAILS_ENV || "development");

const _getDeployContext = () => {
  const env = _getEnvContext();
  if (env !== "production") return env;

  const heroku = HEROKU_APP_NAME || "";
  if (heroku.length === 0) {
    console.warn("WARN: production-ish environment is missing HEROKU_APP_NAME -- defaulting to review");
    return "review";
  }

  return heroku.includes("-production") ? "production" : (heroku.includes("-staging") ? "staging" : "review");
};

export default class Teamshares {
  static env = _getEnvContext();
  static deploy_context = _getDeployContext();
  static deployed_app_sha = HEROKU_SLUG_COMMIT;

  static init (railsObj = Rails) {
    console.log("Initializing Teamshares JS");

    if (Teamshares.env === "production") {
      if (!HONEYBADGER_JS_API_KEY) {
        console.log(`Honeybadger not configured -- set HONEYBADGER_JS_API_KEY to enable (for ${HEROKU_APP_NAME})`);
      } else {
        Honeybadger.configure({
          apiKey: HONEYBADGER_JS_API_KEY,
          environment: Teamshares.deploy_context,
          revision: HEROKU_SLUG_COMMIT,
          debug: true,
        });
        window.Honeybadger = Honeybadger;
      }
    }

    // Overwrite Rails UJS's selectors to include Shoelace elements
    railsObj.buttonClickSelector = {
      selector: railsObj.buttonClickSelector.selector + ", sl-button[data-remote]:not([form]), sl-button[data-confirm]:not([form])",
      exclude: "form button, form sl-button",
    };
    railsObj.linkClickSelector += ", sl-button[href][data-confirm], sl-button[href][data-method], sl-button[href][data-remote]:not([disabled]), sl-button[href][data-disable-with], sl-button[href][data-disable]";
    railsObj.inputChangeSelector += ", sl-select[data-remote], sl-input[data-remote], sl-textarea[data-remote]";
    railsObj.formInputClickSelector += ", form:not([data-turbo=true]) sl-input[type=submit], form:not([data-turbo=true]) sl-input[type=image], form:not([data-turbo=true]) sl-button[type=submit], form:not([data-turbo=true]) sl-button:not([type]), sl-input[type=submit][form], sl-input[type=image][form], sl-button[type=submit][form], sl-button[form]:not([type])";
    railsObj.formDisableSelector += ", sl-input[data-disable-with]:enabled, sl-button[data-disable-with]:enabled, sl-textarea[data-disable-with]:enabled, sl-input[data-disable]:enabled, sl-button[data-disable]:enabled, sl-textarea[data-disable]:enabled";
    railsObj.formEnableSelector += ", sl-input[data-disable-with]:disabled, sl-button[data-disable-with]:disabled, sl-textarea[data-disable-with]:disabled, sl-input[data-disable]:disabled, sl-button[data-disable]:disabled, sl-textarea[data-disable]:disabled";
    railsObj.fileInputSelector += ", sl-input[name][type=file]:not([disabled])";
    railsObj.linkDisableSelector += ", sl-button[href][data-disable-with], sl-button[href][data-disable]";
    railsObj.buttonDisableSelector += ", sl-button[data-remote][data-disable-with], sl-button[data-remote][data-disable]";

    // Register free font-awesome icons
    Shoelace.registerIconLibrary("fa-free", {
      resolver: name => {
        const filename = name.replace(/^fa[rbs]-/, "");
        let folder = "regular";
        if (name.substring(0, 4) === "fas-") folder = "solid";
        if (name.substring(0, 4) === "fab-") folder = "brands";
        return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.3.0/svgs/${folder}/${filename}.svg`;
      },
      mutator: svg => svg.setAttribute("fill", "currentColor"),
    });

    // Register FontAwesome Pro and point at our bespoke "kit" URL, including the token in the querystring
    // See https://fontawesome.com/kits/44da2a9d09/setup
    // Note that the kit allows us to whitelist / deny specific URL patterns
    Shoelace.registerIconLibrary("fa", {
      resolver: name => {
        const filename = name.replace(/^fa([rsltdb]|(ss))-/, "");
        const sub = name.substring(0, 4);
        const folderHash = {
          "fas-": "solid",
          "fal-": "light",
          "fat-": "thin",
          "fad-": "duotone",
          "fab-": "brands",
        };
        const folder = folderHash[sub] || "regular";
        return `https://ka-p.fontawesome.com/releases/v6.4.0/svgs/${folder}/${filename}.svg?token=44da2a9d09`;
      },
      mutator: svg => svg.setAttribute("fill", "currentColor"),
    });
  }
}
