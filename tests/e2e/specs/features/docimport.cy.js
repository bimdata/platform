describe("Documents import feature", () => {

  beforeEach(() => {
    cy.fixture("house-plan.pdf").as("housePlan");

    cy.task("get-user", "user0").then(user => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
  });

  afterEach(() => {
    cy.hook("btn-actions-cell").eq(1).click()
    cy.hook("btn-delete-doc").filter(':visible').click()
    cy.hook("btn-confirm-delete").click()
  })

  it("Should upload a file successfully", () => {
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile('@housePlan', { force: true });

    cy.intercept('**/model').as('getModels')
    cy.wait('@getModels', { timeout: 10000 })

    cy.hook("files-table").contains("tr", "house-plan.pdf").should("have.length", 1);

  })

  it("Should drag and drop a file successfully", () => {
    cy.hook("files-table").selectFile({ contents: '@housePlan', fileName: 'house-plan.pdf' }, { action: 'drag-drop' })

    cy.intercept('**/model').as('getModels')
    cy.wait('@getModels', { timeout: 10000 })

    cy.hook("files-table").contains("tr", "house-plan.pdf").should("have.length", 1);
  })

});

// INPUT IMPORT
// import file
// import folder

// DRAG AND DROP
// import file
// import folder
// import multi file/folder