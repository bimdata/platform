describe("E2E Tests Teardown", () => {
  it("Delete user 0", () => {
    cy.deleteUser({ key: "user0" });
  });

  it("Delete user 1", () => {
    cy.deleteUser({ key: "user1" });
  });

  it("Delete user 2", () => {
    cy.deleteUser({ key: "user2" });
  });
});
