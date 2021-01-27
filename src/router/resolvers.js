import { useProjectsState } from '@/state/projectsState';
import { useSpacesState } from '@/state/spacesState';

const dashboardResolver = () => {
  return useSpacesState().fetchSpaces();
};

const spacesResolver = () => {
  return useSpacesState().fetchSpaces();
};

const projectsResolver = (route) => {
  const { currentSpace, fetchSpaces, selectSpace } = useSpacesState();
  const { fetchProjects } = useProjectsState();

  return fetchSpaces()
    .then(() => selectSpace(+route.params.spaceID))
    .then(() => fetchProjects(currentSpace.value));
};

export {
  dashboardResolver,
  spacesResolver,
  projectsResolver,
}
