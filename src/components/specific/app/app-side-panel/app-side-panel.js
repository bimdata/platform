import { markRaw, ref } from "vue";

const isOpenLeft = ref(false);
const contentLeft = ref(null);

const isOpenRight = ref(false);
const contentRight = ref(null);

const openSidePanel = (side = "right", content = null) => {
  if (content?.component) {
    content.component = markRaw(content.component);
  }
  if (side === "left") {
    contentLeft.value = content;
    isOpenLeft.value = true;
  } else {
    contentRight.value = content;
    isOpenRight.value = true;
  }
};

const closeSidePanel = (side = "right") => {
  if (side === "left") {
    contentLeft.value = null;
    isOpenLeft.value = false;
  } else {
    contentRight.value = null;
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
