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
  const key = `oidc.user:${Cypress.env("IAM_BASE_URL")}/auth/realms/bimdata:${Cypress.env("OIDC_CLIENT_ID")}`;
  localStorage.removeItem(key);
});

Cypress.Commands.add("apiMock", ({ name, method = "GET", path, data }) => {
  const intercept = cy.intercept(method, `${Cypress.env("API_BASE_URL")}${path}`, { fixture: data });
  if (name) {
    intercept.as(name);
  }
});

Cypress.Commands.add("setupApiMocks", () => {
  const mocks = [
    { name: "user",                    path: "/user",                             data: "user.json" },
    { name: "spaces",                  path: "/cloud",                            data: "spaces.json" },
    { name: "projects",                path: "/user/projects",                    data: "projects.json" },
    { name: "space-100-user",          path: "/cloud/100/user",                   data: "spaces/100/users.json" },
    { name: "space-100-invitation",    path: "/cloud/100/invitation",             data: "spaces/100/invitations.json" },
    { name: "space-200-user",          path: "/cloud/200/user",                   data: "spaces/200/users.json" },
    { name: "space-200-invitation",    path: "/cloud/200/invitation",             data: "spaces/200/invitations.json" },
    { name: "space-300-user",          path: "/cloud/300/user",                   data: "spaces/300/users.json" },
    { name: "space-300-invitation",    path: "/cloud/300/invitation",             data: "spaces/300/invitations.json" },
    { name: "project-100-users",       path: "/cloud/100/project/100/user",       data: "projects/100/users.json" },
    { name: "project-100-invitations", path: "/cloud/100/project/100/invitation", data: "projects/100/invitations.json" },
    { name: "project-100-models",      path: "/cloud/100/project/100/ifc",        data: "projects/100/models.json" },
    { name: "project-101-users",       path: "/cloud/100/project/101/user",       data: "projects/101/users.json" },
    { name: "project-101-invitations", path: "/cloud/100/project/101/invitation", data: "projects/101/invitations.json" },
    { name: "project-101-models",      path: "/cloud/100/project/101/ifc",        data: "projects/101/models.json" },
    { name: "project-200-users",       path: "/cloud/200/project/200/user",       data: "projects/200/users.json" },
    { name: "project-200-invitations", path: "/cloud/200/project/200/invitation", data: "projects/200/invitations.json" },
    { name: "project-200-models",      path: "/cloud/200/project/200/ifc",        data: "projects/200/models.json" },
    { name: "project-300-users",       path: "/cloud/300/project/300/user",       data: "projects/300/users.json" },
    { name: "project-300-invitations", path: "/cloud/300/project/300/invitation", data: "projects/300/invitations.json" },
    { name: "project-300-models",      path: "/cloud/300/project/300/ifc",        data: "projects/300/models.json" },
    { name: "model-1001-preview",      path: "/model-preview/1001",               data: "models/1001/preview.png" },
    { name: "model-1001-site",         path: "/cloud/100/project/100/ifc/1001/element?type=IfcSite", data: "models/1001/ifc-site.json" },
    { name: "model-1002-preview",      path: "/model-preview/1002",               data: "models/1002/preview.png" },
    { name: "model-1002-site",         path: "/cloud/100/project/100/ifc/1002/element?type=IfcSite", data: "models/1002/ifc-site.json" }
  ];
  mocks.forEach(cy.apiMock);
});
