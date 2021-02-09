import { useLoadingContext } from "@/state/loading";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

const createViewResolver = resolve => {
  return async route => {
    const loading = useLoadingContext("view-container");
    loading.value = true;
    await resolve(route);
    loading.value = false;
    return;
  };
};

const dashboardResolver = createViewResolver(() => useSpaces().loadSpaces());

const spacesResolver = createViewResolver(() => useSpaces().loadSpaces());

const projectsResolver = createViewResolver(route => {
  const { currentSpace, loadSpaces, selectSpace } = useSpaces();
  const { loadProjects } = useProjects();

  return loadSpaces()
    .then(() => selectSpace(+route.params.spaceID))
    .then(() => loadProjects(currentSpace.value, { forceFetch: true }));
});

export { dashboardResolver, spacesResolver, projectsResolver };
