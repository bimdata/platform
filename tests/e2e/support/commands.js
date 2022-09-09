// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add(
  "createUser",
  ({ key, firstname, lastname }) => {
    cy.task("create-user", { key, firstname, lastname }).then(
      user => {
        cy.visit("/");

        cy.get("a[href^=\"/signup\"]").click();
        cy.get("input[name=email]").type(user.email);
        cy.get("input[name=first_name]").type(user.firstname);
        cy.get("input[name=last_name]").type(user.lastname);
        cy.get("input[name=password1]").type(user.password);
        cy.get("input[name=password2]").type(user.password);
        cy.get("input[type=submit]").click();

        cy.url().should("contain", Cypress.env("IAM_BASE_URL"));
        cy.get("input[type=submit][value=Yes]").click();

        return cy.url()
          .should("contain", Cypress.env("APP_BASE_URL"))
          .then(() => user);
      }
    );
  }
);

Cypress.Commands.add(
  "deleteUser",
  ({ key }) => {
    cy.task("get-user", key).then(
      user => {
        cy.login(user);
        cy.visit(`${Cypress.env("AUTH_BASE_URL")}/profile/delete/`);

        cy.get("input#id_password").type(user.password);
        cy.get("button[type=submit]").click();
      }
    );
  }
);

Cypress.Commands.add(
  "login",
  ({ email, password }) => {
    cy.session([email, password], () => {
      cy.visit("/");

      cy.get("input[name=email]").type(email);
      cy.get("input[name=password]").type(password);
      cy.get("input[type=submit]").click();

      cy.url().should("contain", Cypress.env("APP_BASE_URL"));
    });
  }
);

Cypress.Commands.add(
  "logout",
  () => {
    cy.hook("btn-toggle-app-menu").click();
    cy.hook("btn-logout").click();

    cy.url().should("contain", `${Cypress.env("AUTH_BASE_URL")}/accounts/login`);
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
