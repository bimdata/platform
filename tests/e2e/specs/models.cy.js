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

    cy.hook("models-table").within(() => {
      cy.contains("tr", "ifc-model.ifc").should("have.length", 1);
    });
  });

});
