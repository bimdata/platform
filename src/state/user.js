import { reactive, readonly, toRefs } from "vue";
import UserService from "@/services/UserService.js";
import PlatformService from "@/services/PlatformService.js";

const state = reactive({
  isNew: false,
  user: null,
  spaceRoles: {},
  projectRoles: {}
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

const loadGuidedTours = () => PlatformService.loadGuidedTours();

const setTourCompleted = tour => PlatformService.setTourCompleted(tour);

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
