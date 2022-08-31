describe("Project Features", () => {

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/spaces");
    cy.getHook("space-card").click();
  });

  it("Should create project", () => {
    cy.getHook("project-creation-card.btn-open-create").click();
    cy.getHook("project-creation-card.input-create-name").type("Test Project");
    cy.getHook("project-creation-card.btn-submit-create").click();

    cy.getHook("project-card").should("have.length", 2);
  });

  // it("Should rename project", () => {
  //   // TODO
  // });

  // it("Should delete project", () => {
  //   // TODO
  // });

});