// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

Cypress.Commands.add("login", () => {
  const key =
    "user:https://iam-staging.bimdata.io/auth/realms/bimdata:ab5c58fa-2765-4e8b-be9f-c537c0c46d81";
  const user = {
    id_token: "id-token",
    access_token: "access-token",
    refresh_token: "refresh-token",
    profile: {},
    scope: "openid profile email"

    // Unused fields
    // expires_at: null,
    // session_state: null,
    // state: null,
    // token_type: null,
  };

  localStorage.setItem(key, JSON.stringify(user));
});
