<template>
  <div class="file-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      data-test-id="btn-actions-cell"
      class="file-actions-cell__btn"
      ripple
      rounded
      icon
      @click="() => (isOpen ? closeMenu() : openMenu())"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <BIMDataMenu
      :menuItems="menuItems"
      class="file-actions-cell__menu"
      ref="menu"
      v-show="isOpen"
    >
      <template #item="{ item }">
        <template v-if="item.key === 1">
          <AppLink
            v-if="isViewable(file)"
            class="file-actions-cell__menu__btn"
            :to="{
              name: routeNames.modelViewer,
              params: {
                spaceID: project.cloud.id,
                projectID: project.id,
                modelIDs: file.model_id
              },
              query: {
                window: MODEL_CONFIG[file.model_type].window
              }
            }"
          >
            <BIMDataButton
              class="file-actions-cell__menu__btn__viewer"
              ghost
              squared
              width="100%"
            >
              {{ $t("FileActionsCell.openViewerButtonText") }}
            </BIMDataButton>
          </AppLink>
        </template>
        <template v-else>
          <BIMDataButton
            :color="item.color"
            ghost
            squared
            width="100%"
            :disabled="item.disabled"
            :data-test-id="item.dataTestId"
          >
            {{ item.text }}
          </BIMDataButton>
        </template>
      </template>
    </BIMDataMenu>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { nextTick, ref } from "vue";
import { MODEL_CONFIG } from "../../../../../config/models.js";
import { FILE_PERMISSION } from "../../../../../config/files.js";
import routeNames from "../../../../../router/route-names.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import {
  isConvertible,
  isIFC,
  isModel,
  isViewable
} from "../../../../../utils/models.js";
import { dropdownPositioner } from "../../../../../utils/positioner.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";

export default {
  components: {
    AppLink
  },
  props: {
    filesTable: {
      type: Object
    },
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
    const menu = ref(null);
    const isOpen = ref(false);

    const openMenu = () => {
      if (!props.filesTable) return;

      isOpen.value = true;
      nextTick(() => {
        if (props.filesTable) {
          menu.value.$el.style.top = dropdownPositioner(
            props.filesTable.$el,
            menu.value.$el
          );
        }
      });
    };

    const closeMenu = () => {
      isOpen.value = false;
      nextTick(() => {
        menu.value.$el.style.top = "";
      });
    };

    const onClick = event => {
      closeMenu();
      emit(event, props.file);
    };

    const { t } = useI18n();

    const menuItems = [];

    if (isViewable(props.file)) {
      menuItems.push({
        key: 1,
        get text() {
          return t("FileActionsCell.openViewerButtonText");
        },
        color: "var(--color-primary)"
      });
    }

    if (!isFolder(props.file) && isConvertible(props.file)) {
      if (!isModel(props.file)) {
        menuItems.push({
          key: 2,
          get text() {
            return t("FileActionsCell.createModelButtonText");
          },
          action: () => onClick("create-model")
        });
      } else {
        menuItems.push({
          key: 3,
          get text() {
            return t("FileActionsCell.removeModelButtonText");
          },
          action: () => onClick("remove-model")
        });
      }
    }

    menuItems.push({
      key: 4,
      get text() {
        return t("FileActionsCell.renameButtonText");
      },
      action: () => onClick("update"),
      disabled:
        !props.project.isAdmin &&
        props.file.user_permission < FILE_PERMISSION.READ_WRITE
    });

    menuItems.push({
      key: 5,
      get text() {
        return t("FileActionsCell.downloadButtonText");
      },
      action: () => onClick("download"),
      disabled:
        !props.project.isAdmin &&
        props.file.user_permission < FILE_PERMISSION.READ_WRITE
    });

    if (isFolder(props.file) && props.project.isAdmin) {
      menuItems.push({
        key: 6,
        get text() {
          return t("FileActionsCell.manageAccessButtonText");
        },
        action: () => onClick("manage-access")
      });
    }

    if (
      !isFolder(props.file) &&
      (props.project.isAdmin ||
        props.file.user_permission === FILE_PERMISSION.READ_WRITE)
    ) {
      menuItems.push({
        key: 7,
        get text() {
          return t("FileActionsCell.VisaButtonText");
        },
        action: () => onClick("open-visa-manager")
      });
    }

    if (
      !isFolder(props.file) &&
      (props.project.isAdmin ||
        props.file.user_permission === FILE_PERMISSION.READ_WRITE)
    ) {
      menuItems.push({
        key: 8,
        get text() {
          return t("FileActionsCell.addTagsButtonText");
        },
        action: () => onClick("open-tag-manager"),
        dataTestId: "btn-open-tag-manager"
      });
    }

    if (
      !isFolder(props.file) &&
      (props.project.isAdmin ||
        props.file.user_permission === FILE_PERMISSION.READ_WRITE)
    ) {
      menuItems.push({
        key: 9,
        get text() {
          return t("FileActionsCell.VersioningButtonText");
        },
        action: () => onClick("open-tag-manager"),
        dataTestId: "btn-open-versioning-manager"
      });
    }

    menuItems.push({
      key: 10,
      get text() {
        return t("FileActionsCell.deleteButtonText");
      },
      action: () => onClick("delete"),
      color: "high",
      background: "var(--color-high-lighter)",
      dataTestId: "btn-delete-doc",
      disabled:
        !props.project.isAdmin &&
        props.file.user_permission < FILE_PERMISSION.READ_WRITE
    });

    return {
      // References
      menu,
      isOpen,
      routeNames,
      MODEL_CONFIG,
      menuItems,
      // Methods
      closeMenu,
      isConvertible,
      isViewable,
      isFolder,
      isModel,
      isIFC,
      onClick,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
