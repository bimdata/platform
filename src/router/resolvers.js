import { contexts, useLoadingContext } from "@/composables/loading";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { useUser } from "@/state/user";
import { useFiles } from "@/state/files";

let rootResolved = false;

const rootResolver = async () => {
  const { loadUser } = useUser();
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  if (!rootResolved) {
    await loadUser();
    await loadUserSpaces();
    await loadUserProjects();
    rootResolved = true;
  }
};

const createViewResolver = resolve => {
  return async route => {
    const loading = useLoadingContext(contexts.viewContainer);
    loading.value = true;
    await resolve(route);
    loading.value = false;
  };
};

const spaceBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  await spaces.loadSpaceUsers(spaces.currentSpace.value);
  await spaces.loadSpaceInvitations(spaces.currentSpace.value);
});

const projectBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();
  const files = useFiles();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
  await files.loadProjectFileStructure(projects.currentProject.value);

  await projects.loadProjectUsers(projects.currentProject.value);
  await projects.loadProjectInvitations(projects.currentProject.value);
});

const modelViewerResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
});

export {
  rootResolver,
  spaceBoardResolver,
  projectBoardResolver,
  modelViewerResolver
};
