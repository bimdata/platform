describe("Models features", () => {

  beforeEach(() => {
    cy.fixture("ifc-model.ifc").as("ifcModel");

    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/spaces/1/projects/1");
  });

  it("Should upload an IFC model successfully", () => {
    cy.hook("btn-toggle-upload").click();
    cy.hook("btn-upload-model").click();
    cy.get("body > input[type=file]").selectFile("@ifcModel", { force: true });

    // Assert that the new model appears in models table
    cy.hook("models-table").contains("tr", "ifc-model.ifc").should("have.length", 1);

    // Assert that the new model appears in files table
    cy.hook("project-tab-files").click();
    cy.hook("files-table").contains("tr", "ifc-model.ifc").should("have.length", 1);
  });

  it("Should rename a model", () => {
    // TODO
  });

  it("Should download a model", () => {
    // TODO
  });

  it("Should archive a model", () => {
    // TODO
  });

  it("Should unarchive a model", () => {
    // TODO
  });

  it("Should delete a model", () => {
    // TODO
  });

});
