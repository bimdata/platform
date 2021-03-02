import { contextIDs, useLoadingContext } from "@/state/loading";
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
  if (currentSpace.value.isAdmin) {
    await loadSpaceUsers(currentSpace.value);
    await loadSpaceInvitations(currentSpace.value);
  }
  await loadSpaceProjects(currentSpace.value);
  return;
});

const projectsResolver = createViewResolver(async () => {
  const { loadUserProjects } = useProjects();

  await loadUserProjects();
  return;
});

export {
  rootResolver,
  dashboardResolver,
  spacesResolver,
  spaceBoardResolver,
  projectsResolver
};
