describe("E2E Tests Setup", () => {
  it("Create user 0", () => {
    cy.createUser({ key: "user0", firstname: "Adam", lastname: "Smith" });
  });

  it("Create user 1", () => {
    cy.createUser({ key: "user1", firstname: "John", lastname: "Locke" });
  });

  it("Create user 2", () => {
    cy.createUser({ key: "user2", firstname: "David", lastname: "Hume" });
  });

  it("Wait a moment for accounts creation", () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(20000);
  });
});
