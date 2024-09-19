// ***********************************************
// Cypress helpers for shoelace components
//
// can pass in either a string selector
// or the result of a cypress get() query
// ***********************************************

// sl-button click
Cypress.Commands.add("slButtonClick", (selector, index = 0) => {
  if (typeof selector === "string") {
    cy.get(selector).then(($el) => { $el.get(index).click(); });
  } else {
    selector.then(($el) => { $el.get(index).click(); });
  }
});

// sl-checkbox check
Cypress.Commands.add("slCheckboxCheck", (selector) => {
  if (typeof selector === "string") {
    cy.get(selector).shadow().find("input").check({ force: true });
  } else {
    selector.shadow().find("input").check({ force: true });
  }
});

// sl-checkbox uncheck
Cypress.Commands.add("slCheckboxUncheck", (selector) => {
  if (typeof selector === "string") {
    cy.get(selector).shadow().find("input").uncheck({ force: true });
  } else {
    selector.shadow().find("input").uncheck({ force: true });
  }
});

// sl-dialog close
// Pass in a selector for a dialog, find the embedded close button, and click it
Cypress.Commands.add("slDialogClose", (selector) => {
  cy.get(selector).shadow().find(".dialog__close").click();
});

// sl-input type
Cypress.Commands.add("slInputType", (selector, text = "") => {
  cy.get(selector).shadow().find("input").clear().type(text);
});

// sl-textarea type
Cypress.Commands.add("slTextAreaType", (selector, shadowSelector = "textarea", text = "") => {
  cy.get(selector).shadow().find(shadowSelector).clear().type(text, { force: true });
});

// sl-textarea clear
Cypress.Commands.add("slTextAreaClear", (selector, shadowSelector) => {
  cy.get(selector).shadow().find(shadowSelector).clear({ force: true });
});


// sl-select select by option text
Cypress.Commands.add("slSelectByOptionText", (selector, text) => {
  cy.get(selector)
    .click({force: true})
    .then($select => $select.find(`sl-option:contains("${text}")`))
    .click({force: true});
});

// sl-dropdown select by menu item text
Cypress.Commands.add("slDropdownByMenuItemText", (selector, text) => {
  cy.get(selector)
    .click()
    .then($item => $item.find(`sl-menu-item:contains("${text}")`))
    .click();
});

// ***************************
// Multi component commands
// ***************************

// clear
Cypress.Commands.add("slClear", (selector, area) => {
  cy.get(selector).shadow().find(area).clear();
});

// focus
Cypress.Commands.add("slFocus", (selector, element="input") => {
  cy.get(selector).shadow().find(element).focus();
});
