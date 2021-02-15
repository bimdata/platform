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

const dashboardResolver = createViewResolver(() => useSpaces().loadSpaces());

const spacesResolver = createViewResolver(() => useSpaces().loadSpaces());

const spaceBoardResolver = createViewResolver(async route => {
  const { currentSpace, loadSpaces, loadSpaceUsers, selectSpace } = useSpaces();
  const { loadProjects } = useProjects();

  await loadSpaces();
  await selectSpace(+route.params.spaceID);
  await loadSpaceUsers(currentSpace.value);
  await loadProjects(currentSpace.value);
  return;
});

export { dashboardResolver, spacesResolver, spaceBoardResolver };
