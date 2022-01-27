<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <template v-for="window of ['2d', '3d']" :key="window">
      <AppLink
        :to="{
          name: routeNames.modelViewer,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id,
            modelIDs: model.id
          },
          query: {
            window
          }
        }"
      >
        <BIMDataButton
          class="model-actions-cell__btn model-actions-cell__btn--viewer"
          color="granite"
          outline
          radius
          icon
          :disabled="!isModelReady"
        >
          {{ window.toUpperCase() }}
        </BIMDataButton>
      </AppLink>
    </template>
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
import { useToggle } from "@/composables/toggle.js";
import MODEL_STATUS from "@/config/model-statuses.js";
import routeNames from "@/router/route-names.js";
// Components
import AppLink from "@/components/specific/app/app-link/AppLink.vue";

export default {
  components: {
    AppLink
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
  emits: ["archive", "delete", "download", "update"],
  setup(props, { emit }) {
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

    const onClick = event => {
      closeMenu();
      emit(event, props.model);
    };

    return {
      // References
      isModelReady,
      routeNames,
      showMenu,
      // Methods
      closeMenu,
      onClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
