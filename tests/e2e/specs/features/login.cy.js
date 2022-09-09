describe("Login / Logout features", () => {

  it("Should login & logout successfully", () => {
    cy.task("get-user", "user0").then(({ email, password }) => {
      cy.visit("/");
  
      cy.get("input[name=email]").type(email);
      cy.get("input[name=password]").type(password);
      cy.get("input[type=submit]").click();
  
      // Assert login success
      cy.url().should("contain", Cypress.config("baseUrl"));
  
      cy.hook("btn-toggle-app-menu").click();
      cy.hook("btn-logout").click();
  
      // Assert logout success
      cy.url().should("contain", Cypress.env("LOGIN_URL"));
    });
  });

});