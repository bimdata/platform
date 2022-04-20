import { reactive, readonly, toRefs } from "vue";
import UserService from "@/services/UserService.js";
import PlatformService from "@/services/PlatformService.js";
import { useAuth } from "@/state/auth";

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

const loadGuidedTours = async () => {
  const { accessToken } = useAuth();
  return PlatformService.loadGuidedTours(accessToken.value);
};

const setTourCompleted = async tour => {
  const { accessToken } = useAuth();
  return PlatformService.setTourCompleted(accessToken.value, tour);
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
