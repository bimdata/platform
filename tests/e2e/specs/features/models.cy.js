describe("Models features", () => {
  beforeEach(() => {
    cy.fixture("ifc-model.ifc").as("ifcModel");

    cy.task("get-user", "user0").then((user) => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-overview").click();
  });

  it("Should upload an IFC model successfully", () => {
    cy.hook("btn-toggle-upload").click();
    cy.hook("btn-upload-model").click();
    cy.get("body > input[type=file]").selectFile("@ifcModel", { force: true });

    // New model should appear in models table
    cy.hook("models-table")
      .contains("tr", "ifc-model.ifc")
      .should("have.length", 1);

    // New model should appear in files table
    cy.hook("project-tab-files").click();
    cy.hook("files-table")
      .contains("tr", "ifc-model.ifc")
      .should("have.length", 1);
  });

  it("Should rename a model", () => {
    cy.hook("models-table")
      .contains("tr", "ifc-model.ifc")
      .within(() => {
        cy.hook("btn-toggle-menu").click();
        cy.hook("btn-update-model").click();
        cy.get("input[data-test-id=model-name-input]").type("my-test-model");
        cy.hook("btn-submit-update").click();
      });

    // Model should be renamed in models table
    cy.hook("models-table")
      .contains("tr", "my-test-model")
      .should("have.length", 1);
    cy.hook("models-table").contains("tr", "ifc-model.ifc").should("not.exist");

    // Model should be renamed in files table
    cy.hook("project-tab-files").click();
    cy.hook("files-table")
      .contains("tr", "my-test-model")
      .should("have.length", 1);
    cy.hook("files-table").contains("tr", "ifc-model.ifc").should("not.exist");
  });

  // it("Should download a model", () => {
  //   cy.hook("models-table").contains("tr", "my-test-model").within(() => {
  //     cy.hook("btn-download-model").click();
  //   });

  //   // Cypress.$(".aut-iframe").get(0).contentWindow.dispatchEvent(new Event("load"));
  //   Cypress.$(".aut-iframe").trigger("load");
  // });

  // it("Should archive a model", () => {
  //   // TODO
  // });

  // it("Should unarchive a model", () => {
  //   // TODO
  // });

  it("Should delete a model", () => {
    cy.hook("models-table")
      .contains("tr", "my-test-model")
      .within(() => {
        cy.hook("btn-toggle-menu").click();
        cy.hook("btn-delete-model").click();
      });

    cy.hook("models-delete-modal").within(() => {
      cy.contains("li", "my-test-model").should("have.length", 1);
      cy.hook("btn-submit").click();
    });

    // Model should be removed from models table
    cy.hook("models-table").contains("tr", "my-test-model").should("not.exist");

    // Model should be removed from files table
    cy.hook("project-tab-files").click();
    cy.hook("files-table").contains("tr", "my-test-model").should("not.exist");
  });
});
