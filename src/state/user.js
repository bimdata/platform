import { reactive, readonly, toRefs } from "vue";
import PROJECT_ROLES from "@/config/project-roles.js";
import SPACE_ROLES from "@/config/space-roles.js";
import UserService from "@/services/UserService.js";

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

const setIsNew = value => {
  state.isNew = value;
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
    isAdmin: state.spaceRoles[space.id] === SPACE_ROLES.ADMIN
  }));
};

const mapProjects = projects => {
  return projects.map(project => ({
    ...project,
    isAdmin: state.projectRoles[project.id] === PROJECT_ROLES.ADMIN,
    isUser: state.projectRoles[project.id] === PROJECT_ROLES.USER,
    isGuest: state.projectRoles[project.id] === PROJECT_ROLES.GUEST
  }));
};

export function useUser() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUser,
    setIsNew,
    mapUsers,
    mapSpaces,
    mapProjects
  };
}
