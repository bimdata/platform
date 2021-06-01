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
        <BIMDataButton
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('update')"
        >
          {{ $t("FileActionsCell.renameButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('download')"
        >
          {{ $t("FileActionsCell.downloadButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.addVersionButtonText") }}
        </BIMDataButton>
        <BIMDataButton class="file-actions-cell__menu__btn" ghost squared>
          {{ $t("FileActionsCell.manageAccessButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="file-actions-cell__menu__btn"
          color="high"
          ghost
          squared
          @click="onClick('delete')"
        >
          {{ $t("FileActionsCell.deleteButtonText") }}
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
  emits: [
    "access-clicked",
    "delete-clicked",
    "download-clicked",
    "tags-clicked",
    "update-clicked",
    "validation-clicked",
    "version-clicked"
  ],
  setup(props, { emit }) {
    const showMenu = ref(false);
    const closeMenu = () => {
      showMenu.value = false;
    };
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const onClick = eventType => {
      closeMenu();
      emit(`${eventType}-clicked`, props.file);
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      onClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
