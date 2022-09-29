import { useToggle } from "../../../../composables/toggle.js";

const { isOpen, open, close } = useToggle();

export function useAppModal() {
  return {
    showModal: isOpen,
    openModal: open,
    closeModal: close
  };
}
