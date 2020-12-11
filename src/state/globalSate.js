import { reactive } from 'vue';

const state = reactive({
  isAuthenticated: false
});

export function useGlobalState() {
  return state;
}
