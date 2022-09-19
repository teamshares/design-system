const Honeybadger = require("@honeybadger-io/js");

export const initHoneybadger = (opts = {}) => {
  if (process.env.RAILS_ENV !== "production" || !process.env.HEROKU_APP_NAME) return;

  const heroku = process.env.HEROKU_APP_NAME;
  const appContext = heroku.includes("-production") ? "production" : (heroku.includes("-staging") ? "staging" : "review");

  if (!process.env.HONEYBADGER_JS_API_KEY) {
    console.log(`Honeybadger not configured -- set HONEYBADGER_JS_API_KEY to enable (for ${heroku})`);
    return;
  }

  const config = Object.assign({
    apiKey: process.env.HONEYBADGER_JS_API_KEY,
    environment: appContext
  }, opts);

  Honeybadger.configure(config);
  window.Honeybadger = Honeybadger;
};
