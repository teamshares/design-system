// ***********************************************
// Cypress helpers for shoelace components
//
// can pass in either a string selector
// or the result of a cypress get() query
// ***********************************************

// ***************************
// Multi component commands
// ***************************

// clear
Cypress.Commands.add("slClear", (selector, element = "input") => {
  cy.get(selector).shadow().find(element).clear({ force: true });
});

// focus
Cypress.Commands.add("slFocus", (selector, element = "input") => {
  cy.get(selector).shadow().find(element).focus({ force: true });
});

// ***************************
// ts_form_for
// ***************************

// sl-input type
Cypress.Commands.add("slInputType", (selector, text = "") => {
  cy.slFocus(selector).clear({ force: true }).type(text);
});

// sl-textarea type
Cypress.Commands.add("slTextAreaType", (selector, text = "") => {
  cy.slFocus(selector, "textarea").clear({ force: true }).type(text, { force: true });
});

// sl-textarea clear
Cypress.Commands.add("slTextAreaClear", (selector) => {
  cy.slClear(selector, "textarea");
});

// sl-checkbox check
Cypress.Commands.add("slCheckboxCheck", (selector) => {
  cy.slFocus(selector).check({ force: true });
});

// sl-checkbox uncheck
Cypress.Commands.add("slCheckboxUncheck", (selector) => {
  cy.slFocus(selector).uncheck({ force: true });
});

// sl-checkbox-group value
Cypress.Commands.add("slCheckboxGroupValue", (selector, expectedValue) => {
  cy.get(selector).invoke("val").should("deep.equal", expectedValue);
});

// sl-select select by option text
Cypress.Commands.add("slSelectByOptionText", (selector, text) => {
  cy.get(selector)
    .click({ force: true })
    .then($select => $select.find(`sl-option:contains("${text}")`))
    .click({ force: true });
});

// sl-select select by option text
Cypress.Commands.add("slSelectValue", (selector) => {
  cy.get(selector).invoke("val");
});

// sl-button click
Cypress.Commands.add("slButtonClick", (selector, index = 0) => {
  if (typeof selector === "string") {
    cy.get(selector).then(($el) => { $el.get(index).click(); });
  } else {
    selector.then(($el) => { $el.get(index).click(); });
  }
});

// ***************************
// other
// ***************************

// sl-dialog close
// Pass in a selector for a dialog, find the embedded close button, and click it
Cypress.Commands.add("slDialogClose", (selector) => {
  cy.get(selector).shadow().find(".dialog__close").click();
});

// sl-dropdown select by menu item text
Cypress.Commands.add("slDropdownByMenuItemText", (selector, text) => {
  cy.get(selector)
    .click()
    .then($item => $item.find(`sl-menu-item:contains("${text}")`))
    .click();
});
