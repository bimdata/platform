import { useToggle } from "@/composables/toggle.js";

const { isOpen, open, close } = useToggle();

export function usePaiementModal() {
  return {
    isOpen,
    openPaiementModal: open,
    closePaiementModal: close
  };
}
