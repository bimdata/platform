import { contextIDs, useLoadingContext } from "@/state/loading";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { useUser } from "@/state/user";

const rootResolver = async () => {
  const { loadUser } = useUser();

  await loadUser();
  return;
};

const createViewResolver = resolve => {
  return async route => {
    const loading = useLoadingContext(contextIDs.viewContainer);
    loading.value = true;
    await resolve(route);
    loading.value = false;
    return;
  };
};

const dashboardResolver = createViewResolver(async () => {
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  await loadUserSpaces();
  await loadUserProjects();
  return;
});

const userSpacesResolver = createViewResolver(async () => {
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  await loadUserSpaces();
  await loadUserProjects();
  return;
});

const userProjectsResolver = createViewResolver(async () => {
  const { loadUserProjects } = useProjects();

  await loadUserProjects();
  return;
});

const spaceBoardResolver = createViewResolver(async route => {
  const {
    currentSpace,
    loadUserSpaces,
    loadSpaceUsers,
    loadSpaceInvitations,
    selectSpace
  } = useSpaces();
  const { loadSpaceProjects } = useProjects();

  await loadUserSpaces();
  await selectSpace(+route.params.spaceID);
  if (currentSpace.value.isAdmin) {
    await loadSpaceUsers(currentSpace.value);
    await loadSpaceInvitations(currentSpace.value);
  }
  await loadSpaceProjects(currentSpace.value);
  return;
});

const projectBoardResolver = createViewResolver(async route => {
  const { currentSpace, loadUserSpaces, selectSpace } = useSpaces();
  const {
    currentProject,
    loadUserProjects,
    loadSpaceProjects,
    loadProjectUsers,
    loadProjectInvitations,
    selectProject
  } = useProjects();
  const { loadProjectModels } = useModels();

  await loadUserSpaces();
  await loadUserProjects();
  await selectSpace(+route.params.spaceID);
  await loadSpaceProjects(currentSpace.value);
  await selectProject(+route.params.projectID);
  if (currentProject.value.isAdmin) {
    await loadProjectUsers(currentProject.value);
    await loadProjectInvitations(currentProject.value);
  }
  await loadProjectModels(currentProject.value);
  return;
});

export {
  rootResolver,
  dashboardResolver,
  userSpacesResolver,
  userProjectsResolver,
  spaceBoardResolver,
  projectBoardResolver
};
