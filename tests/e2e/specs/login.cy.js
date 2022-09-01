describe("Login / Logout features", () => {

  it("Should login & logout successfully", () => {
    cy.visit("/");

    cy.get("input[name=email]").type(Cypress.env("USER_EMAIL"));
    cy.get("input[name=password]").type(Cypress.env("USER_PASSWORD"));
    cy.get("input[type=submit]").click();

    // Assert login success
    cy.url().should("contain", Cypress.config("baseUrl"));

    cy.hook("btn-toggle-app-menu").click();
    cy.hook("btn-logout").click();

    // Assert logout success
    cy.url().should("contain", Cypress.env("LOGIN_BASE_URL"));
  });

});