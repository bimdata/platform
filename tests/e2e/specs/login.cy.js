describe("Login Test", () => {

  it("Should login successfully", () => {
    cy.visit("/");

    cy.get("input[name=email]").type(Cypress.env("USER_EMAIL"));
    cy.get("input[name=password]").type(Cypress.env("USER_PASSWORD"));
    cy.get("input[type=submit]").click();

    // Assert
    cy.url().should("contain", Cypress.config("baseUrl"));
  });

});