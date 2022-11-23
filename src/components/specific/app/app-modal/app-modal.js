import { markRaw, ref } from "vue";

const isOpen = ref(false);
const content = ref(null);

const openModal = ({ component, props } = {}) => {
  if (component) {
    content.value = {
      component: markRaw(component),
      props
    };
  }
  isOpen.value = true;
};

const closeModal = () => {
  content.value = null;
  isOpen.value = false;
};

export function useAppModal() {
  return {
    content,
    showModal: isOpen,
    openModal,
    closeModal
  };
}
