<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="model-actions-cell__btn model-actions-cell__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="true"
      @click="() => {}"
    >
      2D
    </BIMDataButton>
    <BIMDataButton
      class="model-actions-cell__btn model-actions-cell__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="true"
      @click="() => {}"
    >
      3D
    </BIMDataButton>
    <BIMDataButton
      class="model-actions-cell__btn"
      ripple
      rounded
      icon
      @click="onDownloadClick"
    >
      <BIMDataIcon name="download" size="m" />
    </BIMDataButton>
    <BIMDataButton
      class="model-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="model-actions-cell__menu" v-show="showMenu">
        <BIMDataButton class="model-actions-cell__menu__btn" ghost squared>
          {{ $t("ModelActionMenu.buttonAddTags") }}
        </BIMDataButton>
        <BIMDataButton
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onUpdateClick"
        >
          {{ $t("ModelActionMenu.buttonRename") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="!model.archived"
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onArchiveClick"
        >
          {{ $t("ModelActionMenu.buttonArchive") }}
        </BIMDataButton>
        <BIMDataButton
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onDeleteClick"
        >
          {{ $t("ModelActionMenu.buttonDelete") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  emits: [
    "download-clicked",
    "update-clicked",
    "archive-clicked",
    "delete-clicked"
  ],
  setup(props, { emit }) {
    const showMenu = ref(false);
    const closeMenu = () => {
      showMenu.value = false;
    };
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const onDownloadClick = () => {
      emit("download-clicked", props.model);
    };

    const onUpdateClick = () => {
      closeMenu();
      emit("update-clicked", props.model);
    };

    const onArchiveClick = () => {
      closeMenu();
      emit("archive-clicked", props.model);
    };

    const onDeleteClick = () => {
      closeMenu();
      emit("delete-clicked", props.model);
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      onArchiveClick,
      onDeleteClick,
      onDownloadClick,
      onUpdateClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
