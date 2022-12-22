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

  it("Create user 3", () => {
    cy.createUser({ key: "user3", firstname: "Stefan", lastname: "Zweig" });
  });

  it("Should login & logout successfully", () => {
    cy.task("get-user", "user0").then(({ email, password }) => {
      cy.visit("/");
  
      cy.get("input[name=email]").type(email);
      cy.get("input[name=password]").type(password);
      cy.get("input[type=submit]").click();
  
      // Assert login success
      cy.url().should("contain", Cypress.env("APP_BASE_URL"));
  
      cy.hook("btn-toggle-app-menu", { timeout: 60000 }).click();
      cy.hook("btn-logout").click();
  
      // Assert logout success
      cy.url().should("contain", `${Cypress.env("AUTH_BASE_URL")}/accounts/login`);
    });
  });
});
