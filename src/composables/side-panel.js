import { useToggle } from "./toggle.js";

const { isOpen, open, close } = useToggle();

export function useSidePanel() {
  return {
    showSidePanel: isOpen,
    openSidePanel: open,
    closeSidePanel: close
  };
}
