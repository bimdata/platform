const KEY_PREFIX = "bimdata-platform";

const STORAGE_KEYS = Object.freeze({
  CURRENT_PROJECT_VIEW: `${KEY_PREFIX}:current-project-view`,
  DEFAULT_ROUTING_MODE: `${KEY_PREFIX}:default-routing-mode`
});

const currentProjectView = {
  get: projectID => {
    return sessionStorage.getItem(
      `${STORAGE_KEYS.CURRENT_PROJECT_VIEW}:${projectID}`
    );
  },
  set: (projectID, viewKey) => {
    sessionStorage.setItem(
      `${STORAGE_KEYS.CURRENT_PROJECT_VIEW}:${projectID}`,
      viewKey
    );
  }
};

const defaultRoutingMode = {
  get: () => {
    return sessionStorage.getItem(STORAGE_KEYS.DEFAULT_ROUTING_MODE) === "yes";
  },
  set: value => {
    sessionStorage.setItem(
      STORAGE_KEYS.DEFAULT_ROUTING_MODE,
      value ? "yes" : ""
    );
  }
};

export function useSession() {
  return {
    currentProjectView,
    defaultRoutingMode
  };
}
