describe("Auth Scenarios", () => {

  beforeEach(() => {
    cy.setupMocks();
    cy.logout();
  });

  it("Should land on login page when logged out", () => {
    cy.visit("/");
    cy.url().should("contain", Cypress.env("LOGIN_BASE_URL"));
  });

  it("Should land on home page when logged in", () => {
    cy.login();
    cy.visit("/");
    cy.wait(["@user", "@spaces", "@projects"]);

    cy.url().should("contain", Cypress.config("baseUrl"));
    cy.getHook("user-name").should("contain", "Toto LABRICO");
  });

  /**
   * This test currently fails because Cypress does not allow to visit
   * more than one super domain in the same test (which is probably a good thing though).
   * Needs refactoring.
   */
  // it("Should be able to log out properly", () => {
  //   cy.login();
  //   cy.visit("/");
  //   cy.wait(["@user", "@spaces", "@projects"]);

  //   cy.getHook("user-name").click();
  //   cy.getHook("btn-logout").click();

  //   cy.url().should("contain", Cypress.env("LOGIN_BASE_URL"));
  // });

});
