import { contextIDs, useLoadingContext } from "@/state/loading";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

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

const spacesResolver = createViewResolver(async () => {
  const { loadUserSpaces } = useSpaces();
  const { loadUserProjects } = useProjects();

  await loadUserSpaces();
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
  await loadSpaceUsers(currentSpace.value);
  await loadSpaceInvitations(currentSpace.value);
  await loadSpaceProjects(currentSpace.value);
  return;
});

const projectsResolver = createViewResolver(async () => {
  const { loadUserProjects } = useProjects();

  await loadUserProjects();
  return;
});

export {
  dashboardResolver,
  spacesResolver,
  spaceBoardResolver,
  projectsResolver
};
