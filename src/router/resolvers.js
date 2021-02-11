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

const spaceBoardResolver = createViewResolver(route => {
  const { currentSpace, loadSpaces, loadSpaceUsers, selectSpace } = useSpaces();
  const { loadProjects } = useProjects();

  return loadSpaces()
    .then(() => selectSpace(+route.params.spaceID))
    .then(() => loadSpaceUsers(currentSpace.value, { forceFetch: true }))
    .then(() => loadProjects(currentSpace.value, { forceFetch: true }));
});

export { dashboardResolver, spacesResolver, spaceBoardResolver };
