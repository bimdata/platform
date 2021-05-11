describe("Dashboard Scenarios", () => {

  beforeEach(() => {
    cy.setupMocks();
    cy.login();
    cy.visit("/");
    cy.wait(["@user", "@spaces", "@projects"]);
  });

  it("Should be able to access user spaces", () => {
    cy.getHook("dashboard.btn-spaces").click();
    cy.location("pathname").should("eq", "/spaces");
  });

  it("Should be able to access user projects", () => {
    cy.getHook("dashboard.btn-projects").click();
    cy.location("pathname").should("eq", "/projects");
  });

  it("Should be able to access a specific space", () => {
    // TODO
  });

  it("Should be able to access a specific project", () => {
    // TODO
  });

});