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
        <AppLink
          v-if="isViewable(file)"
          class="file-actions-cell__menu__btn"
          :to="{
            name: routeNames.modelViewer,
            params: {
              spaceID: project.cloud.id,
              projectID: project.id,
              modelIDs: file.modelId
            },
            query: {
              window: windowType(file)
            }
          }"
        >
          <BIMDataButton
            class="file-actions-cell__menu__btn__viewer"
            ghost
            squared
          >
            {{ $t("FileActionsCell.openViewerButtonText") }}
          </BIMDataButton>
        </AppLink>
        <template v-if="!isFolder(file) && isConvertible(file)">
          <template v-if="!isModel(file)">
            <BIMDataButton
              class="file-actions-cell__menu__btn"
              ghost
              squared
              @click="onClick('create-model')"
            >
              {{ $t("FileActionsCell.createModelButtonText") }}
            </BIMDataButton>
          </template>
          <template v-else>
            <BIMDataButton
              class="file-actions-cell__menu__btn"
              ghost
              squared
              @click="onClick('remove-model')"
            >
              {{ $t("FileActionsCell.removeModelButtonText") }}
            </BIMDataButton>
          </template>
        </template>

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
          v-if="isFolder(file) && project.isAdmin"
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
          v-if="
            !isFolder(file) && (project.isAdmin || file.userPermission === 100)
          "
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('open-tag-manager')"
        >
          {{ $t("FileActionsCell.addTagsButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="
            !isFolder(file) && (project.isAdmin || file.userPermission === 100)
          "
          class="file-actions-cell__menu__btn"
          ghost
          squared
          @click="onClick('open-versioning-manager')"
        >
          {{ $t("FileActionsCell.VersioningButtonText") }}
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
import { useToggle } from "@/composables/toggle.js";
import routeNames from "@/router/route-names.js";
import { isFolder } from "@/utils/file-structure.js";
import {
  isConvertible,
  isIFC,
  isModel,
  isSmartFile,
  isViewable,
  windowType
} from "@/utils/models.js";
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
    file: {
      type: Object,
      required: true
    }
  },
  emits: [
    "create-model",
    "delete",
    "download",
    "manage-access",
    "open-versioning-manager",
    "open-visa-manager",
    "update",
    "open-tag-manager",
    "remove-model"
  ],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const onClick = event => {
      closeMenu();
      emit(event, props.file);
    };

    return {
      // References
      routeNames,
      showMenu,
      // Methods
      closeMenu,
      isConvertible,
      isViewable,
      isFolder,
      isModel,
      isIFC,
      isSmartFile,
      onClick,
      toggleMenu,
      windowType
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
