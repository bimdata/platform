import { reactive, readonly, toRefs } from "vue";
import UserService from "@/server/UserService";
import { PROJECT_ROLE, SPACE_ROLE } from "@/utils/users";

const state = reactive({
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

const mapUsers = users => {
  return users.map(user => ({
    ...user,
    isSelf: user.id === state.user.id
  }));
};

const mapSpaces = spaces => {
  return spaces.map(space => ({
    ...space,
    isAdmin: state.spaceRoles[space.id] === SPACE_ROLE.ADMIN
  }));
};

const mapProjects = projects => {
  return projects.map(project => ({
    ...project,
    isAdmin: state.projectRoles[project.id] === PROJECT_ROLE.ADMIN
  }));
};

export function useUser() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUser,
    mapUsers,
    mapSpaces,
    mapProjects
  };
}
