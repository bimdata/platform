import { useToggle } from "../../../../composables/toggle.js";
const { isOpen, open, close } = useToggle();

export function useAppGlobalLoader() {
  return {
    showGlobalLoader: isOpen,
    openGlobalLoader: open,
    closeGlobalLoader: close
  };
}
