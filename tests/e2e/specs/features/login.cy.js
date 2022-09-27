describe("Login / Logout features", () => {

  // it("Should login & logout successfully", () => {
  //   cy.task("get-user", "user0").then(({ email, password }) => {
  //     cy.visit("/");
  
  //     cy.get("input[name=email]").type(email);
  //     cy.get("input[name=password]").type(password);
  //     cy.get("input[type=submit]").click();
  
  //     // Assert login success
  //     cy.url().should("contain", Cypress.env("APP_BASE_URL"));
  
  //     cy.hook("btn-toggle-app-menu").click({ timeout: 60000 });
  //     cy.hook("btn-logout").click();
  
  //     // Assert logout success
  //     cy.url().should("contain", `${Cypress.env("AUTH_BASE_URL")}/accounts/login`);
  //   });
  // });

});