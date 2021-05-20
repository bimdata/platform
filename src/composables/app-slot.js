import { ref } from "vue";

const slots = {};

export function useAppSlot(name) {
  if (!slots[name]) {
    slots[name] = ref(null);
  }
  return slots[name];
}
