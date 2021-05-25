<template>
  <div class="file-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="file-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="file-actions-cell__menu" v-show="showMenu">
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.addTagsButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.validationRequestButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.renameButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.downloadButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.addVersionButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.manageAccessButtonText") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  setup() {
    const showMenu = ref(false);
    const closeMenu = () => {
      showMenu.value = false;
    };
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
