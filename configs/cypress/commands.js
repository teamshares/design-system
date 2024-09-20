// These commands are available to all cypress specs
// (they reference paths added via teamshares-rails)

import "./sl-commands";

Cypress.Commands.add("factory", (name, opts = {}) => {
  const { traits, ...attributes } = opts;
  cy.request("POST", "teamshares/cypress/factories", {
    name,
    traits,
    attributes,
  });
});

Cypress.Commands.add("factoryId", (alias, callbackFn) => {
  cy.get(alias).then((factoryResponse) => { callbackFn(factoryResponse.body.id); });
});

Cypress.Commands.add("login", (email) => {
  cy.request("POST", "teamshares/cypress/sessions", { email });
});

Cypress.Commands.add("flipper_enable", (feature) => {
  cy.request("POST", "teamshares/cypress/flippers", { feature });
});

Cypress.Commands.add("flipper_disable", (feature) => {
  cy.request("DELETE", "teamshares/cypress/flippers", { feature });
});

Cypress.Commands.add("flipper_enable_group", (feature, group) => {
  cy.request("POST", "teamshares/cypress/flippers", { feature, group });
});

Cypress.Commands.add("flipper_disable_group", (feature, group) => {
  cy.request("DELETE", "teamshares/cypress/flippers", { feature, group });
});
