describe("Project features", () => {
  beforeEach(() => {
    cy.task("get-user", "user0").then((user) => {
      cy.login(user);
      cy.visit("/spaces");
      cy.contains(
        "[data-test-id=space-card]",
        `${user.firstname} ${user.lastname}`
      ).click();
    });
  });

  it("Should create project", () => {
    cy.hook("project-creation-card.btn-open-create").click();
    cy.get("input[data-test-id=input-create-name]").type("Test Project");
    cy.hook("project-creation-card.btn-submit-create").click();

    cy.getProjectCard("Test Project").should("have.length", 1);
  });

  it("Should rename project", () => {
    cy.getProjectCard("Test Project").within(() => {
      cy.hook("btn-open-menu").click();
      cy.hook("btn-open-update").click({ force: true });
      cy.get("input[data-test-id=input-update-name]").type("New Project Name", {
        force: true
      });
      cy.hook("btn-submit-update").click({ force: true });
    });

    cy.getProjectCard("New Project Name").should("have.length", 1);
    cy.getProjectCard("Test Project").should("not.exist");
  });

  it("Should delete project", () => {
    cy.getProjectCard("New Project Name").within(() => {
      cy.hook("btn-open-menu").click();
      cy.hook("btn-open-delete").click({ force: true });
      cy.hook("btn-submit-delete").click({ force: true });
    });

    cy.getProjectCard("New Project Name").should("not.exist");
  });
});
