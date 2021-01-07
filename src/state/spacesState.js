import { reactive, readonly, toRefs } from 'vue';
import SpacesService from '@/api/SpacesService';

const state = reactive({
  spaces: []
});

const fetchSpaces = () => SpacesService.fetchUserSpaces().then(
  spaces => state.spaces = spaces
);

export function useSpacesState() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    fetchSpaces
  };
}
