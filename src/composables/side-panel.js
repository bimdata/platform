import { useToggle } from "./toggle";

const { isOpen, open, close } = useToggle();

export function useSidePanel() {
  return {
    showSidePanelOpen: isOpen,
    openSidePanel: open,
    closeSidePanel: close
  };
}
