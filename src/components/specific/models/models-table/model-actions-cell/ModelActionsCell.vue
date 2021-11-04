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
      :disabled="!project.isAdmin && model.document.userPermission < 100"
      class="model-actions-cell__btn"
      ripple
      rounded
      icon
      @click="onClick('download')"
    >
      <BIMDataIcon name="download" size="m" />
    </BIMDataButton>
    <BIMDataButton
      :disabled="!project.isAdmin && model.document.userPermission < 100"
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
          class="model-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick(model.archived ? 'unarchive' : 'archive')"
        >
          {{
            $t(
              `ModelActionsCell.${
                model.archived ? "unarchiveButtonText" : "archiveButtonText"
              }`
            )
          }}
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useToggle } from "@/composables/toggle";
import MODEL_STATUS from "@/config/model-statuses";
import routeNames from "@/router/route-names.js";

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

    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

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
