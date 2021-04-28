describe("Basic Scenarios", () => {

  beforeEach(() => {
    cy.logout();
    cy.intercept("GET", `${Cypress.env("API_BASE_URL")}/user`, {
      fixture: "user.json"
    }).as("getUser");
    cy.intercept("GET", `${Cypress.env("API_BASE_URL")}/cloud`, {
      fixture: "user-spaces.json"
    }).as("getSpaces");
    cy.intercept("GET", `${Cypress.env("API_BASE_URL")}/user/projects`, {
      fixture: "user-projects.json"
    }).as("getProjects");
  });

  it("Should access home page when logged in", () => {
    cy.login();
    cy.visit("/");
    cy.wait(["@getUser", "@getSpaces", "@getProjects"]);
    cy.url().should("contain", Cypress.config("baseUrl"));
  });

});
