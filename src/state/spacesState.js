import { reactive, readonly, toRefs } from 'vue';
import SpacesService from '@/api/SpacesService';

const state = reactive({
  spaces: []
});

const fetchSpaces = () => SpacesService.fetchUserSpaces().then(
  spaces => state.spaces = spaces
);

const createSpace = (space) => SpacesService.createSpace(space).then(
  createdSpace => state.spaces = state.spaces.concat(createdSpace)
);

const updateSpace = (space) => SpacesService.updateSpace(space).then(
  updatedSpace => state.spaces = state.spaces.map(
    s => s.id === updatedSpace.id ? updatedSpace : s
  )
);

const softUpdateSpace = (space) => state.spaces = state.spaces.map(
  s => s.id === space.id ? space : s
);

const deleteSpace = (space) => SpacesService.deleteSpace(space).then(
  () => state.spaces = state.spaces.filter(s => s.id !== space.id)
);

export function useSpacesState() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    fetchSpaces,
    createSpace,
    updateSpace,
    softUpdateSpace,
    deleteSpace
  };
}
