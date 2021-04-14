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
  const spaces = useSpaces();
  const projects = useProjects();

  await spaces.loadUserSpaces();
  await projects.loadUserProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  if (spaces.currentSpace.value.isAdmin) {
    await spaces.loadSpaceUsers(spaces.currentSpace.value);
    await spaces.loadSpaceInvitations(spaces.currentSpace.value);
  }
  return;
});

const projectBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();

  await spaces.loadUserSpaces();
  await projects.loadUserProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);

  if (projects.currentProject.value.isAdmin) {
    await projects.loadProjectUsers(projects.currentProject.value);
    await projects.loadProjectInvitations(projects.currentProject.value);
  }
  return;
});

const modelViewerResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();

  await spaces.loadUserSpaces();
  await projects.loadUserProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);

  // models.selectModel(+route.params.modelID); ???
  return;
});

export {
  rootResolver,
  dashboardResolver,
  userSpacesResolver,
  userProjectsResolver,
  spaceBoardResolver,
  projectBoardResolver,
  modelViewerResolver
};
