describe("Documents import feature", () => {

  beforeEach(() => {
    cy.fixture("house-plan.pdf").as("housePlan");

    cy.task("get-user", "user0").then(user => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
  });

  it("Should upload a file successfully", () => {
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile('@housePlan', { force: true });

    cy.intercept('**/model').as('getModels')
    cy.wait('@getModels', { timeout: 10000 })

    cy.hook("files-table").contains("tr", "house-plan.pdf").should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf")
  })

  it("Should drag and drop a file successfully", () => {
    cy.hook("files-table").selectFile({ contents: '@housePlan', fileName: 'house-plan.pdf' }, { action: 'drag-drop' })

    cy.intercept('**/model').as('getModels')
    cy.wait('@getModels', { timeout: 10000 })

    cy.hook("files-table").contains("tr", "house-plan.pdf").should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf")
  })

  it("Should drag and drop multiple file successfully", () => {
    cy.fixture("terminaux-plafond.dwg").as("terminauxPlafond");

    cy.hook("files-table").selectFile([{ contents: '@housePlan', fileName: 'house-plan.pdf' }, '@terminauxPlafond'], { action: 'drag-drop' })

    cy.intercept('**/model').as('getModels')
    cy.wait('@getModels', { timeout: 10000 })

    cy.hook("files-table").contains("tr", "house-plan.pdf").should("have.length", 1);
    cy.hook("files-table").contains("tr", "terminaux-plafond.dwg").should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf")
    cy.deleteGedDoc("terminaux-plafond.dwg")

  })
});