import { ref } from "vue";

const state = {};

export function useAppLoading(name) {
  return state[name] ?? (state[name] = ref(false));
}

export async function load(name, promises) {
  const loading = useAppLoading(name);
  loading.value = true;
  await Promise.all(promises);
  loading.value = false;
}
