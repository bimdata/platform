// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit("/");

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[type=submit]").click();

    cy.url().should("contain", Cypress.config("baseUrl"));
  });
});

Cypress.Commands.add("getHook", path => {
  const selector = path.split(".").map(name => `[data-test-id=${name}]`).join(" ");
  return cy.get(selector);
});

Cypress.Commands.add("getParam", path => {
  return cy.getHook(path).its("dataset.testParam");
});
