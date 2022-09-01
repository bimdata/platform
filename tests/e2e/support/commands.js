// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit("/");

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[type=submit]").click();

    cy.url().should("contain", Cypress.config("baseUrl"));
  });
});

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
