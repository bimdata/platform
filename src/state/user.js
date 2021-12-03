import { reactive, readonly, toRefs } from "vue";
import UserService from "@/services/UserService";
import PROJECT_ROLES from "@/config/project-roles";
import SPACE_ROLES from "@/config/space-roles";
import { projectStatus } from "@/utils/projects";

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
    isSelf: user.userId === state.user.id
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
    isGuest: state.projectRoles[project.id] === PROJECT_ROLES.GUEST,
    projectStatus: projectStatus(project)
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
