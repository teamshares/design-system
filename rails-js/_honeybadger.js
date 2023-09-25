import Honeybadger from "@honeybadger-io/js";

// The next line tells eslint to accept the undef vars (these are specifically injected into esbuild's build process)
/* global process */
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;
const RAILS_ENV = process.env.RAILS_ENV;
const HONEYBADGER_JS_API_KEY = process.env.HONEYBADGER_JS_API_KEY;
const HEROKU_SLUG_COMMIT = process.env.HEROKU_SLUG_COMMIT;

const getAppContext = () => {
  const heroku = HEROKU_APP_NAME || "";
  if (heroku.length === 0) return;

  return heroku.includes("-production") ? "production" : (heroku.includes("-staging") ? "staging" : "review");
};

export const initHoneybadger = (opts = {}) => {
  if (RAILS_ENV !== "production") return;

  const appContext = getAppContext();
  if (!appContext) {
    console.log("WARN: production-ish environment is missing HEROKU_APP_NAME -- NOT initializing Honeybadger");
    return;
  }

  if (!HONEYBADGER_JS_API_KEY) {
    console.log(`Honeybadger not configured -- set HONEYBADGER_JS_API_KEY to enable (for ${HEROKU_APP_NAME})`);
    return;
  }

  const config = Object.assign({
    apiKey: HONEYBADGER_JS_API_KEY,
    environment: appContext,
    revision: HEROKU_SLUG_COMMIT,
  }, opts);

  Honeybadger.configure(config);
  window.Honeybadger = Honeybadger;
};
