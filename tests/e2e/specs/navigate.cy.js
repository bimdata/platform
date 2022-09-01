/* eslint-disable cypress/no-unnecessary-waiting */

describe("Navigation Test", () => {

  beforeEach(() => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/");
  });

  it("Should navigate throw platform views", () => {
    cy.hook("btn-spaces").click().wait(200);
    cy.hook("space-card").click().wait(200);
    cy.hook("project-card").click().wait(500);

    cy.hook("btn-open-viewer").click().wait(10000);
    cy.hook("go-back-button").click().wait(500);

    cy.hook("project-tab-files").click().wait(200);

    cy.hook("project-tab-bcf").click().wait(200);

    cy.hook("project-tab-overview").click();
  });

});