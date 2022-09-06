import { reactive, readonly, toRefs } from "vue";
import PlatformService from "../services/PlatformService.js";
import UserService from "../services/UserService.js";

const state = reactive({
  isNew: false,
  user: null,
  spaceRoles: {},
  projectRoles: {},
  completedTours: []
});

const loadUser = async () => {
  const user = await UserService.fetchUserData();
  state.user = user;

  state.spaceRoles = user.clouds.reduce(
    (roles, role) => ({ ...roles, [role.cloud]: role.role }),
    {}
  );
  state.projectRoles = user.projects.reduce(
    (roles, role) => ({ ...roles, [role.project]: role.role }),
    {}
  );

  return user;
};

const loadGuidedTours = async () => {
  const tours = await PlatformService.loadGuidedTours();
  state.completedTours = tours;

  return tours;
};

const setTourCompleted = async tour => {
  await PlatformService.setTourCompleted(tour);
  await loadGuidedTours();
};

const setIsNew = value => {
  state.isNew = value;
};

export function useUser() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUser,
    setIsNew,
    loadGuidedTours,
    setTourCompleted
  };
}
