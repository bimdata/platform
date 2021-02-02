import { useLoadingContext } from "@/state/loading";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

const createViewResolver = resolver => {
  return route => {
    const loading = useLoadingContext("view-container");
    loading.value = true;
    return resolver(route).then(() => (loading.value = false));
  };
};

const dashboardResolver = createViewResolver(() => useSpaces().fetchSpaces());

const spacesResolver = createViewResolver(() => useSpaces().fetchSpaces());

const projectsResolver = createViewResolver(route => {
  const { currentSpace, fetchSpaces, selectSpace } = useSpaces();
  const { fetchProjects } = useProjects();

  return fetchSpaces()
    .then(() => selectSpace(+route.params.spaceID))
    .then(() => fetchProjects(currentSpace.value));
});

export { dashboardResolver, spacesResolver, projectsResolver };
