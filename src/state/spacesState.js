import { reactive, toRefs } from 'vue';
import SpacesService from '@/api/SpacesService';

const state = reactive({
  spaces: []
});

export function useSpacesState() {
  const fetchSpaces = () => SpacesService.fetchUserSpaces().then(
    spaces => state.spaces = spaces
  );

  return {
    ...toRefs(state),
    fetchSpaces
  };
}
