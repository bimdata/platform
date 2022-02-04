import { ref } from "vue";

const slots = {};

export function useAppSlot(name) {
  return slots[name] ?? (slots[name] = ref(null));
}
