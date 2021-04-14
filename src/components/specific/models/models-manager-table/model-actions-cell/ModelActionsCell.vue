<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="model-actions-cell__btn model-actions-cell__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="!isModelReady"
      @click="goToModelViewer('2d')"
    >
      2D
    </BIMDataButton>
    <BIMDataButton
      class="model-actions-cell__btn model-actions-cell__btn--viewer"
      color="primary"
      outline
      radius
      icon
      :disabled="!isModelReady"
      @click="goToModelViewer('3d')"
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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { MODEL_STATUS } from "@/utils/models";
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
    const router = useRouter();

    const showMenu = ref(false);
    const closeMenu = () => {
      showMenu.value = false;
    };
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const isModelReady = computed(
      () =>
        MODEL_STATUS.PENDING !== props.model.status &&
        MODEL_STATUS.IN_PROGRESS !== props.model.status
    );

    const goToModelViewer = window => {
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelID: props.model.id
        },
        query: {
          window
        }
      });
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
      isModelReady,
      showMenu,
      // Methods
      closeMenu,
      goToModelViewer,
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
