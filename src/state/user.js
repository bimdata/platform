import { reactive, readonly, toRefs } from "vue";
import { FILE_PERMISSION } from "../config/files.js";
import { PROJECT_ROLE } from "../config/projects.js";
import { SPACE_ROLE } from "../config/spaces.js";
import UserService from "../services/UserService.js";

import { useOrganizations } from "./organizations.js";

const { userOrganizations } = useOrganizations();

// ---

const state = reactive({
  isNew: false,
  user: null,
  spaceRoles: {},
  projectRoles: {},
  guidedTours: [],
  favorites: {}
});

const loadUser = async () => {
  const user = await UserService.fetchUserData();
  const favorites = await UserService.fetchUserFavorites();
  state.user = user;
  state.favorites = favorites;

  state.spaceRoles = user.clouds.reduce((roles, role) => {
    roles[role.cloud] = role.role;
    return roles;
  }, {});
  state.projectRoles = user.projects.reduce((roles, role) => {
    roles[role.project] = role.role;
    return roles;
  }, {});

  return user;
};

const setIsNew = value => {
  state.isNew = value;
};

const addFavoriteSpace = async space => {
  const res = await UserService.addFavoriteSpace(space);
  state.favorites = await UserService.fetchUserFavorites();
  return res;
};

const removeFavoriteSpace = async space => {
  const res = await UserService.removeFavoriteSpace(space);
  state.favorites = await UserService.fetchUserFavorites();
  return res;
};

const addFavoriteProject = async project => {
  const res = await UserService.addFavoriteProject(project);
  state.favorites = await UserService.fetchUserFavorites();
  return res;
};

const removeFavoriteProject = async project => {
  const res = await UserService.removeFavoriteProject(project);
  state.favorites = await UserService.fetchUserFavorites();
  return res;
};

const loadGuidedTours = async () => {
  const tours = await UserService.fetchGuidedTours();
  state.guidedTours = tours;
  return tours;
};

const setGuidedTourComplete = async tour => {
  await UserService.setGuidedTourComplete(tour);
  await loadGuidedTours();
};

const isSelf = user => {
  return user && state.user.id === (user.user_id || user.id);
};

const isUserOrga = space => {
  return !!userOrganizations.value.find(orga => orga.id === space.organization.id);
};

const isSpaceAdmin = space => {
  return state.spaceRoles[space?.id] === SPACE_ROLE.ADMIN;
};

const isProjectAdmin = project => {
  return state.projectRoles[project?.id] === PROJECT_ROLE.ADMIN;
};

const isProjectGuest = project => {
  return state.projectRoles[project?.id] === PROJECT_ROLE.GUEST;
};

const isFavoriteSpace = space => {
  return state.favorites.cloud_ids.includes(space.id);
};

const isFavoriteProject = project => {
  return state.favorites.project_ids.includes(project.id);
};

const isGuidedTourComplete = tour => {
  return state.guidedTours.some(t => t.name === tour.name);
};

function hasAdminPerm(project, file) {
  const files = [].concat(file);
  return !isProjectGuest(project) &&
    (isProjectAdmin(project) || files.every(f => f?.user_permission === FILE_PERMISSION.READ_WRITE));
}

function hasAdminPermModel(project, model) {
  const models = [].concat(model);
  return hasAdminPerm(project, models.map(m => m.document));
}

export function useUser() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUser,
    setIsNew,
    addFavoriteSpace,
    removeFavoriteSpace,
    addFavoriteProject,
    removeFavoriteProject,
    loadGuidedTours,
    setGuidedTourComplete,
    isSelf,
    isUserOrga,
    isSpaceAdmin,
    isProjectAdmin,
    isProjectGuest,
    isFavoriteSpace,
    isFavoriteProject,
    isGuidedTourComplete,
    hasAdminPerm,
    hasAdminPermModel,
  };
}
