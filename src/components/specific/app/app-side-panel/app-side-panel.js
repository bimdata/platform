import { ref } from "vue";

const isOpenLeft = ref(false);
const contentLeft = ref(null);

const isOpenRight = ref(false);
const contentRight = ref(null);

const openSidePanel = (side = "right") => {
  if (side === "left") {
    isOpenLeft.value = true;
  } else {
    isOpenRight.value = true;
  }
};

const closeSidePanel = (side = "right") => {
  if (side === "left") {
    isOpenLeft.value = false;
  } else {
    isOpenRight.value = false;
  }
};

export function useAppSidePanel() {
  return {
    isOpenLeft,
    contentLeft,
    isOpenRight,
    contentRight,
    openSidePanel,
    closeSidePanel
  };
}
