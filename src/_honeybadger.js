const Honeybadger = require("@honeybadger-io/js");

const getAppContext = () => {
  // TODO: Kali - remove this var once upstream Heroku/Doppler issues resolved
  if (process.env.EXPLICIT_APP_CONTEXT) return process.env.EXPLICIT_APP_CONTEXT;
  if (!process.env.HEROKU_APP_NAME) {
    console.log("WARN: production-ish environment is missing both HEROKU_APP_NAME and EXPLICIT_APP_CONTEXT");
    return;
  }

  const heroku = process.env.HEROKU_APP_NAME;
  return heroku.includes("-production") ? "production" : (heroku.includes("-staging") ? "staging" : "review");
};

export const initHoneybadger = (opts = {}) => {
  if (process.env.RAILS_ENV !== "production") return;
  const appContext = getAppContext();
  if (!appContext) return;

  if (!process.env.HONEYBADGER_JS_API_KEY) {
    console.log(`Honeybadger not configured -- set HONEYBADGER_JS_API_KEY to enable (for ${process.env.HEROKU_APP_NAME})`);
    return;
  }

  const config = Object.assign({
    apiKey: process.env.HONEYBADGER_JS_API_KEY,
    environment: appContext
  }, opts);

  Honeybadger.configure(config);
  window.Honeybadger = Honeybadger;
};
