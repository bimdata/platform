import { reactive, readonly, toRefs } from "vue";
import UserService from "@/server/UserService";
import { PROJECT_ROLE, SPACE_ROLE } from "@/utils/users";

const state = reactive({
  user: null,
  adminSpaces: [],
  adminProjects: []
});

const loadUser = async () => {
  const user = await UserService.fetchUserData();
  state.user = user;
  state.adminSpaces = user.clouds
    .filter(role => role.role === SPACE_ROLE.ADMIN)
    .map(role => role.cloud);
  state.adminProjects = user.projects
    .filter(role => role.role === PROJECT_ROLE.ADMIN)
    .map(role => role.project);
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
    isAdmin: state.adminSpaces.includes(space.id)
  }));
};

const mapProjects = projects => {
  return projects.map(project => ({
    ...project,
    isAdmin: state.adminProjects.includes(project.id)
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
