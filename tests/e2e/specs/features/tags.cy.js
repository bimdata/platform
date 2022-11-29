describe("Tags CRUD", () => {

  const tagList = ["outdated", "priority", "lyon"]

  beforeEach(() => {
    cy.viewport(1220, 728)
    cy.task("get-user", "user0").then(user => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
  });

  it("Should create tags successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-tag-manager").click();

    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.createTag(tag)))));
    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.hook("tag-list").contains("div", tag).should("have.length", 1)))));
  })

  it("Should update tags successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-tag-manager").click();

    cy.hook("tag-list").contains("div[data-test-id=tags-item]", "outdated").within(() => {
      cy.hook("btn-edit-tag-name").click();
      cy.get("input[name=edit-tag-name]").type("done{enter}");
    });

    cy.hook("tag-list").contains('outdated').should('not.exist');
    cy.hook("tag-list").contains('done');

    // revert name modification 
    cy.hook("tag-list").contains("div[data-test-id=tags-item]", "done").within(() => {
      cy.hook("btn-edit-tag-name").click();
      cy.get("input[name=edit-tag-name]").type("outdated{enter}");
    });

    cy.hook("tag-list").contains("div[data-test-id=tags-item]", "outdated").within(() => {
      cy.hook("btn-edit-tag-color").click();
      cy.intercept('**/tag/*').as('getTag');

      cy.get('div[class=color-selector__line__element]').not('.selected').eq(0).click();

      cy.wait('@getTag').its('response.statusCode').should('eq', 200);
    });
  });

  it("Should link tags to a document successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-tag-manager").click();

    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.hook("tag-list").contains("div[data-test-id=tags-item]", tag).within(() => {
      cy.hook("checkbox-add-tag").click();
    })))));


    cy.hook("btn-close-tag-manager").click();

    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.hook("files-table").contains(tag)))));

  });

  it("Should unlink tags to a document successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-tag-manager").click();

    cy.hook("tag-list").contains("div[data-test-id=tags-item]", "outdated").within(() => {
      cy.hook("checkbox-add-tag").click();
    });
    cy.hook("tag-list").contains("div[data-test-id=tags-item]", "priority").within(() => {
      cy.hook("checkbox-add-tag").click();
    });

    cy.hook("btn-close-tag-manager").click();

    cy.hook("files-table").contains('outdated');
    cy.hook("files-table").contains('priority');
  })

  it("Should delete tags successfully", () => {
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-tag-manager").click();

    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.deleteTag(tag)))));
    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.hook("tag-list").contains(tag).should('not.exist')))));

    cy.hook("btn-close-tag-manager").click();

    cy.wrap(new Promise(resolve => resolve(tagList.map(tag => cy.hook("files-table").contains(tag).should('not.exist')))));
  })
});