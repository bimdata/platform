import { onBeforeUnmount, onMounted } from "vue";

export function useInterval(callback, ms = 1000) {
  let intervalId;
  onMounted(() => {
    intervalId = setInterval(callback, ms);
  });
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
  return intervalId;
}
