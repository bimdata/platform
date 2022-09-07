// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add(
  "createUser",
  (firstname, lastname) => {
    cy.task("generate-logins").then(
      ({ email, password }) => {
        cy.visit("/");

        cy.get("a[href^=\"/signup\"]").click();
        cy.get("input[name=email]").type(email);
        cy.get("input[name=first_name]").type(firstname);
        cy.get("input[name=last_name]").type(lastname);
        cy.get("input[name=password1]").type(password);
        cy.get("input[name=password2]").type(password);
        cy.get("input[type=submit]").click();

        cy.url().should("contain", Cypress.env("IAM_BASE_URL"));
        cy.get("input[type=submit][value=Yes]").click();

        return cy.url().should("contain", Cypress.config("baseUrl"))
          .then(() => ({
            firstname,
            lastname,
            email,
            password
          })
        );
      }
    );
  }
);

Cypress.Commands.add(
  "deleteUser",
  (email, password) => {
    cy.visit(`${Cypress.env("AUTH_BASE_URL")}/profile/delete/`);

    cy.get("input#id_password").type(password);
    cy.get("button[type=submit]").click();
  }
);

Cypress.Commands.add(
  "login",
  (email, password) => {
    cy.session([email, password], () => {
      cy.visit("/");

      cy.get("input[name=email]").type(email);
      cy.get("input[name=password]").type(password);
      cy.get("input[type=submit]").click();

      cy.url().should("contain", Cypress.config("baseUrl"));
    });
  }
);

Cypress.Commands.add(
  "hook", 
  path => cy.get(path.split(".").map(name => `[data-test-id=${name}]`).join(" "))
);
Cypress.Commands.add(
  "findHook",
  { prevSubject: true },
  (subject, id) => subject.find(`[data-test-id=${id}]`)
);
Cypress.Commands.add(
  "withParam",
  { prevSubject: true },
  (subject, param) => subject.filter(`[data-test-param=${param}]`)
);
Cypress.Commands.add(
  "param",
  { prevSubject: true },
  subject => subject.data("testParam")
);

Cypress.Commands.add(
  "getSpaceCard",
  name => cy.contains("[data-test-id=space-card]", name)
);
Cypress.Commands.add(
  "getProjectCard",
  name => cy.contains("[data-test-id=project-card]", name)
);
