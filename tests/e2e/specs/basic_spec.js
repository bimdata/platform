describe("Basic Scenarios", () => {

  beforeEach(() => {
    cy.logout();
    cy.setupApiMocks();
  });

  it("Should access home page when logged in", () => {
    cy.login();
    cy.visit("/");
    cy.wait(["@user", "@spaces", "@projects"]);
    cy.url().should("contain", Cypress.config("baseUrl"));
  });

});
