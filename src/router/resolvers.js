import { useLoadingContext } from '@/state/loadingState';
import { useProjectsState } from '@/state/projectsState';
import { useSpacesState } from '@/state/spacesState';

const createViewResolver = (resolver) => {
  return (route) => {
    const loading = useLoadingContext('view-container');
    loading.value = true;
    return resolver(route).then(
      () => loading.value = false
    );
  };
};

const dashboardResolver = createViewResolver(
  () => useSpacesState().fetchSpaces()
);

const spacesResolver = createViewResolver(
  () => useSpacesState().fetchSpaces()
);

const projectsResolver = createViewResolver(
  (route) => {
    const { currentSpace, fetchSpaces, selectSpace } = useSpacesState();
    const { fetchProjects } = useProjectsState();

    return fetchSpaces()
      .then(() => selectSpace(+route.params.spaceID))
      .then(() => fetchProjects(currentSpace.value));
  }
);

export {
  dashboardResolver,
  spacesResolver,
  projectsResolver,
};
