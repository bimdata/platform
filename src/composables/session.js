const KEY_PREFIX = "bimdata-platform";

const STORAGE_KEYS = Object.freeze({
  CURRENT_VIEW: `${KEY_PREFIX}:current-view`,
  PREVIOUS_VIEW: `${KEY_PREFIX}:previous-view`,
  PROJECT_VIEW: `${KEY_PREFIX}:project-view`,
  PROJECT_MODEL_TAB: `${KEY_PREFIX}:project-model-tab`
});

const getEntry = key => JSON.parse(sessionStorage.getItem(key));

const setEntry = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));

const currentView = {
  get() {
    return getEntry(`${STORAGE_KEYS.CURRENT_VIEW}`);
  },
  set(value) {
    setEntry(`${STORAGE_KEYS.CURRENT_VIEW}`, value);
  }
};

const previousView = {
  get() {
    return getEntry(`${STORAGE_KEYS.PREVIOUS_VIEW}`);
  },
  set(value) {
    setEntry(`${STORAGE_KEYS.PREVIOUS_VIEW}`, value);
  }
};

const projectView = {
  get(projectID) {
    return getEntry(`${STORAGE_KEYS.PROJECT_VIEW}:${projectID}`);
  },
  set(projectID, viewKey) {
    setEntry(`${STORAGE_KEYS.PROJECT_VIEW}:${projectID}`, viewKey);
  }
};

const projectModelTab = {
  get(projectID) {
    return getEntry(`${STORAGE_KEYS.PROJECT_MODEL_TAB}:${projectID}`);
  },
  set(projectID, tabKey) {
    setEntry(`${STORAGE_KEYS.PROJECT_MODEL_TAB}:${projectID}`, tabKey);
  }
};

export function useSession() {
  return {
    currentView,
    previousView,
    projectView,
    projectModelTab
  };
}
