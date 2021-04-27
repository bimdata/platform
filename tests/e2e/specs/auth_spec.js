describe("Authentication Scenarios", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Should redirect to login page if not logged in", () => {
    cy.visit("/").wait(2000);
    cy.url().should("match", /connect(.?)*\.bimdata\.io/);
  });

  it("Should access home page when logged in", () => {
    cy.login();
    cy.visit("/").wait(2000);
    cy.url().should("match", /localhost/);
  });
});
