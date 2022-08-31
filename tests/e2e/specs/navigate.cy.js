/* eslint-disable cypress/no-unnecessary-waiting */

describe("Navigation Test", () => {

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/");
  });

  it("Should navigate throw platform views", () => {
    cy.getHook("btn-spaces").click().wait(200);
    cy.getHook("space-card").click().wait(200);
    cy.getHook("project-card").click().wait(500);

    cy.getHook("btn-open-viewer").click().wait(10000);
    cy.getHook("go-back-button").click().wait(500);

    cy.getHook("project-tab-files").click().wait(200);

    cy.getHook("project-tab-bcf").click().wait(200);

    cy.getHook("project-tab-overview").click();
  });

});