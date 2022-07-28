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

Cypress.Commands.add("getHook", names => {
  const selector = names.split(".").map(name => `[data-test-id=${name}]`).join(" ");
  return cy.get(selector);
});
