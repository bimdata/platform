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
      @click="onClick('download')"
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
        <!-- <BIMDataButton class="model-actions-cell__menu__btn" ghost squared>
          {{ $t("ModelActionsCell.addTagsButtonText") }}
        </BIMDataButton> -->
        <BIMDataButton
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('update')"
        >
          {{ $t("ModelActionsCell.renameButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="!model.archived"
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('archive')"
        >
          {{ $t("ModelActionsCell.archiveButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="model-actions-cell__menu__btn"
          color="high"
          ghost
          squared
          @click="onClick('delete')"
        >
          {{ $t("ModelActionsCell.deleteButtonText") }}
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

export default {
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
  emits: ["archive", "delete", "download", "update"],
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
          modelIDs: props.model.id
        },
        query: {
          window
        }
      });
    };

    const onClick = event => {
      closeMenu();
      emit(event, props.model);
    };

    return {
      // References
      isModelReady,
      showMenu,
      // Methods
      closeMenu,
      goToModelViewer,
      onClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
