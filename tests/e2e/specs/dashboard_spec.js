describe("Dashboard scenarios", () => {

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
    cy.getHook("dashboard.space-card").first().click();
    cy.location("pathname").should("match", /\/spaces\/(\d+)/);
  });

  it("Should be able to access a specific project", () => {
    cy.getHook("dashboard.project-card").first().click();
    cy.location("pathname").should("match", /\/spaces\/(\d+)\/projects\/(\d+)/);
  });

});
