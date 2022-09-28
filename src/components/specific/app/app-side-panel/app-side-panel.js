import { useToggle } from "../../../../composables/toggle.js";

const { isOpen, open, close } = useToggle();

export function useAppSidePanel() {
  return {
    showSidePanel: isOpen,
    openSidePanel: open,
    closeSidePanel: close
  };
}
