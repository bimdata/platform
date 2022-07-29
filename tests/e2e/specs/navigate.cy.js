describe("Navigation Test", () => {

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/");
  });

  it("Should navigate to user spaces", () => {
    cy.getHook("btn-spaces").click().wait(200);
    cy.getHook("space-card").click().wait(200);
    // cy.getParam("project-card").should(value => console.log("test param: ", value));
  });

});