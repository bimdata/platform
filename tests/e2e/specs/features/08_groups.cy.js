describe("Groups features", () => {
  beforeEach(() => {
    cy.task("get-user", "user0").then((user) => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-manage-groups").click();
  });

  it("Should create group", () => {
    cy.hook("btn-open-create").click();
    cy.get("input[data-test-id=input-create-name]").type("Test Group{enter}");

    cy.getGroupCard("Test Group").should("have.length", 1);
  });

  it("Should rename group", () => {
    cy.getGroupCard("Test Group").within(() => {
      cy.hook("btn-open-menu").click();
      cy.hook("btn-open-update").click({ force: true });
      cy.get("input[data-test-id=input-update-name]").type("New Group Name", {
        force: true,
      });
      cy.hook("btn-submit-update").click({ force: true });
    });

    cy.getGroupCard("New Group Name").should("have.length", 1);
    cy.getGroupCard("Test Group").should("not.exist");
  });

  it.skip("Should change group color", () => {
    // TODO
  });

  it("Should add member to group", () => {
    cy.getGroupCard("New Group Name").click();
    cy.hook("btn-open-member-selector").click();
    cy.task("get-user", "user2").then(({ email }) => {
      cy.contains("[data-test-id=user-list-item]", email).within(() => {
        cy.hook("btn-add-member").click();
      });
      cy.contains("[data-test-id=group-member-card]", email).should(
        "have.length",
        1
      );
    });
  });

  it("Should remove member from group", () => {
    cy.getGroupCard("New Group Name").click();
    cy.task("get-user", "user2").then(({ email }) => {
      cy.contains("[data-test-id=group-member-card]", email).within(() => {
        cy.hook("btn-remove-member").click();
      });
      cy.contains("[data-test-id=group-member-card]", email).should(
        "not.exist"
      );
    });
  });

  it("Should delete group", () => {
    cy.getGroupCard("New Group Name").within(() => {
      cy.hook("btn-open-menu").click();
      cy.hook("btn-open-delete").click({ force: true });
      cy.hook("btn-submit-delete").click({ force: true });
    });

    cy.getGroupCard("New Group Name").should("not.exist");
  });
});
