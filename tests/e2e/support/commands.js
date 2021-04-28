// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add("login", () => {
  const key = `oidc.user:${Cypress.env("IAM_BASE_URL")}/auth/realms/bimdata:${Cypress.env("OIDC_CLIENT_ID")}`;
  const user = {};

  localStorage.setItem(key, JSON.stringify(user));
});

Cypress.Commands.add("logout", () => {
  localStorage.clear();
});
