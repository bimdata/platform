import { reactive, readonly, toRefs } from 'vue';
import SpacesService from '@/api/SpacesService';

const state = reactive({
  spaces: [],
  currentSpace: null,
});

const fetchSpaces = () => {
  return SpacesService.fetchUserSpaces().then(
    spaces => state.spaces = spaces
  );
};

const createSpace = (space) => {
  return SpacesService.createSpace(space).then(
    newSpace => state.spaces = [newSpace].concat(state.spaces)
  );
};

const updateSpace = (space) => {
  return SpacesService.updateSpace(space).then(softUpdateSpace);
};

const softUpdateSpace = (space) => {
  state.spaces = state.spaces.map(s => s.id === space.id ? space : s);
};

const removeSpaceImage = (space) => {
  return SpacesService.removeSpaceImage(space).then(softUpdateSpace);
};

const deleteSpace = (space) => {
  return SpacesService.deleteSpace(space).then(
    () => state.spaces = state.spaces.filter(s => s.id !== space.id)
  );
};

const selectSpace = (id) => {
  state.currentSpace = state.spaces.find(s => s.id === id) || null;
};

export function useSpacesState() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    fetchSpaces,
    createSpace,
    updateSpace,
    softUpdateSpace,
    removeSpaceImage,
    deleteSpace,
    selectSpace,
  };
}
