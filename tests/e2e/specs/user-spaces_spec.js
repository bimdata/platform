describe("User Spaces scenarios", () => {

  beforeEach(() => {
    cy.setupMocks();
    cy.login();
    cy.visit("/spaces");
    cy.wait(["@user", "@spaces", "@projects"]);
  });

  it("Should display all user spaces", () => {
    cy.getHook("user-spaces.space-card").should("have.length", 3);
  });

  it("Should be able to access space board", () => {
    cy.getHook("space-card-100").click();
    cy.location("pathname").should("eq", "/spaces/100");
  });

  it("Should be able to open menu if admin", () => {
    cy.getHook("space-card-100.btn-toggle-menu")
      .should("be.visible")
      .click();

    cy.getHook("space-card-100.btn-open-update")
      .should("be.visible");
    cy.getHook("space-card-100.btn-update-image")
      .should("be.visible");
    cy.getHook("space-card-100.btn-delete-image")
      .should("be.visible");
    cy.getHook("space-card-100.btn-open-delete")
      .should("be.visible");
    
    cy.getHook("space-card-100.btn-toggle-menu")
      .click();
    cy.getHook("space-card-100.btn-open-update")
      .should("not.be.visible");
    cy.getHook("space-card-100.btn-update-image")
      .should("not.be.visible");
    cy.getHook("space-card-100.btn-delete-image")
      .should("not.be.visible");
    cy.getHook("space-card-100.btn-open-delete")
      .should("not.be.visible");
  });

  it("Should be able to edit space name", () => {
    cy.getHook("space-card-100.btn-toggle-menu").click();
    cy.getHook("space-card-100.btn-open-update").click();
    cy.getHook("space-card-100.update-form").should("be.visible");

    cy.getHook("space-card-100.input-update-name").find("input")
      .type("New space name");

    // cy.getHook("space-card-100.btn-submit-update").click();
    // cy.wait("@update-space-100");

    cy.getHook("space-card-100.btn-close-update").click();
    cy.getHook("space-card-100.update-form").should("not.exist");
  });

  it("Should be able to delete space", () => {
    cy.getHook("space-card-100.btn-toggle-menu").click();
    cy.getHook("space-card-100.btn-open-delete").click();

    cy.getHook("space-card-100.delete-guard")
      .should("be.visible");

    // cy.getHook("space-card-100.btn-submit-delete").click();
    // cy.wait("@delete-space-100");

    cy.getHook("space-card-100.btn-close-delete").click();
    cy.getHook("space-card-100.delete-guard").should("not.exist");
  });

  it("Should not be able to open menu if not admin", () => {
    cy.getHook("space-card-300.btn-toggle-menu").should("not.exist");
  });

  it("Should be able to create a space", () => {
    cy.getHook("user-spaces.btn-open-create").click();
    cy.getHook("space-creation-card").should("be.visible");

    cy.getHook("space-creation-card.input-create-name").find("input")
      .type("Brave new space");

    // cy.getHook("space-creation-card.btn-submit-create").click();
    // cy.wait("@create-space");

    cy.getHook("space-creation-card.btn-close-create").click();
    cy.getHook("space-creation-card").should("not.exist");
  });

});
