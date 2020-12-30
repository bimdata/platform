import { reactive, toRefs } from 'vue';

const state = reactive({
  isAuthenticated: false,
  loading: false,
});

export function useGlobalState() {
  return {
    ...toRefs(state)
  };
}
