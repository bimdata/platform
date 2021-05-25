import { contextIDs, useLoadingContext } from "@/state/loading";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { useUser } from "@/state/user";
import { useFiles } from "@/state/files";

const rootResolver = async () => {
  const { loadUser } = useUser();

  await loadUser();
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
});

const userSpacesResolver = createViewResolver(async () => {
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  await loadUserSpaces();
  await loadUserProjects();
});

const userProjectsResolver = createViewResolver(async () => {
  const { loadUserProjects } = useProjects();

  await loadUserProjects();
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
});

const projectBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();
  const files = useFiles();

  await spaces.loadUserSpaces();
  await projects.loadUserProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
  await files.loadProjectFileStructure(projects.currentProject.value);

  if (projects.currentProject.value.isAdmin) {
    await projects.loadProjectUsers(projects.currentProject.value);
    await projects.loadProjectInvitations(projects.currentProject.value);
  }
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
