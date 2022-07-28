describe("Navigation Test", () => {

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/");
  });

  it("Should navigate to user spaces", () => {
    cy.get("[data-test=btn-spaces]").click();
    // cy.get("[data-test~=space-card]").click();
    cy.get(".app-link[href^=\"/spaces\"]").click();
  });

});