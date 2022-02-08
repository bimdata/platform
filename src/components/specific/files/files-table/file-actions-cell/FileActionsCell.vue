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
        <BIMDataButton
          v-if="file.modelType === 'IFC'"
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="goToModelViewer()"
        >
          {{ $t("FileActionsCell.openViewerButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          :disabled="!project.isAdmin && file.userPermission < 100"
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('update')"
        >
          {{ $t("FileActionsCell.renameButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          :disabled="!project.isAdmin && file.userPermission < 100"
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('download')"
        >
          {{ $t("FileActionsCell.downloadButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="project.isAdmin && isFolder(file)"
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('manage-access')"
        >
          {{ $t("FileActionsCell.manageAccessButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="
            !isFolder(file) && (project.isAdmin || file.userPermission === 100)
          "
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('open-visa-manager')"
        >
          {{ $t("FileActionsCell.VisaButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          :disabled="!project.isAdmin && file.userPermission < 100"
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
import { useRouter } from "vue-router";
import { useToggle } from "@/composables/toggle.js";
import routeNames from "@/router/route-names.js";
import { isFolder } from "@/utils/file-structure.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    }
  },
  emits: ["delete", "download", "manage-access", "update", "open-visa-manager"],
  setup(props, { emit }) {
    const router = useRouter();

    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const goToModelViewer = () => {
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: props.file.modelId
        },
        query: {
          window: "3d"
        }
      });
    };

    const onClick = event => {
      closeMenu();
      emit(event, props.file);
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      goToModelViewer,
      onClick,
      toggleMenu,
      isFolder
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
