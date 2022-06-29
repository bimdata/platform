const routeNames = Object.freeze({
  // Base routes
  root: "root",
  oidcCallback: "oidc-callback",
  oidcCallbackError: "oidc-callback-error",
  pageNotFound: "page-not-found",
  dashboard: "dashboard",
  userSpaces: "user-spaces",
  userProjects: "user-projects",
  spaceBoard: "space-board",
  projectBoard: "project-board",
  projectGroups: "project-groups",
  groupBoard: "group-board",
  modelViewer: "model-viewer",
  invitation: "invitation",
  // Subscription routes
  userSubscriptions: "user-subscriptions",
  subscribe: "subscribe",
  subscriptionFree: "subscription-free",
  subscriptionPro: "subscription-pro",
  subscriptionDatapack: "subscription-datapack"
});

export default routeNames;
