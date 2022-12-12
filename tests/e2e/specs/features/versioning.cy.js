describe("versioning CRUD", () => {

  beforeEach(() => {
    cy.viewport(1220, 728)
    cy.fixture("house-plan.pdf").as("housePlan");

    cy.task("get-user", "user0").then(user => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
  });

  it("Should add a version successfully", () => {

    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-versioning-manager").click();

    cy.hook("btn-add-version").click();
    cy.get("body > input[type=file]").selectFile("@housePlan", { force: true });

    cy.hook("versioning-doc").first().within(() => {
      cy.contains("house-plan.pdf");
    });

    cy.hook("files-table").contains("tbody tr", "house-plan.pdf").should("have.length", 1);
  });

  it("Should add a new version and update version tree successfully", () => {
    cy.fixture("terminaux-plafond.dwg").as("terminauxPlafond");

    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-versioning-manager").click();

    cy.hook("btn-add-version").click();
    cy.get("body > input[type=file]").selectFile("@terminauxPlafond", { force: true });

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("versioning-doc").first().within(() => {
      cy.contains("terminaux-plafond.dwg");
    });
    cy.hook("versioning-doc").last().within(() => {
      cy.contains("19 rue Marc Antoine Petit");
    });
    cy.hook("files-table").contains("tbody tr", "terminaux-plafond.dwg").should("have.length", 1);

  });

  it("Should pass a previous version to current version successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-versioning-manager").click();

    cy.hook("versioning-doc").last().within(() => {
      cy.hook("btn-get-to-head").click();
    });

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("versioning-doc").first().within(() => {
      cy.contains("19 rue Marc Antoine Petit");
    });
    cy.hook("versioning-doc").last().within(() => {
      cy.contains("house-plan.pdf");
    });
    cy.hook("files-table").contains("tr", "19 rue Marc Antoine Petit").should("have.length", 1);

  })

  it("Should delete the version historical successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-versioning-manager").click();

    cy.hook("versioning-doc").last().within(() => {
      cy.hook("btn-delete-version").click();
    });
    cy.hook("btn-confirm-delete").click();

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("versioning-main").contains("house-plan.pdf").should("not.exist");

    cy.hook("versioning-doc").last().within(() => {
      cy.hook("btn-delete-version").click();
    });
    cy.hook("btn-confirm-delete").click();

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("versioning-main").contains("terminaux-plafond.dwg").should("not.exist");
  });
});