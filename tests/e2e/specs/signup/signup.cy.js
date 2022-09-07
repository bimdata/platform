describe("Signup Test", () => {

  it("Should sign up successfully", () => {
    // cy.visit("/");

    // cy.get("a[href^=\"/signup\"]").click();
    // cy.get("input[name=email]").type(Cypress.env("USER_EMAIL"));
    // cy.get("input[name=first_name]").type(Cypress.env("USER_FIRSTNAME"));
    // cy.get("input[name=last_name]").type(Cypress.env("USER_LASTNAME"));
    // cy.get("input[name=password1]").type(Cypress.env("USER_PASSWORD"));
    // cy.get("input[name=password2]").type(Cypress.env("USER_PASSWORD"));
    // cy.get("input[type=submit]").click();
    
    // cy.url().should("contain", Cypress.env("IAM_BASE_URL"));
    // cy.get("input[type=submit][value=Yes]").click();
    
    // cy.url().should("contain", Cypress.config("baseUrl"));

    cy.createUser("John", "Doe").then(({ email, password }) => {
      cy.wait(3000);
      cy.deleteUser(email, password);
    });
  });

});
