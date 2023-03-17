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
              <BIMDataIcon :name="item.icon" size="xs" margin="0 12px 0 0" />
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
            <div v-if="item.component" class="m-r-12">
              <component :is="item.component" width="16px" height="14px" />
            </div>
            <BIMDataIcon
              v-else
              :name="item.icon"
              size="xs"
              margin="0 12px 0 0"
            />

            <span>{{ $t(item.text) }}</span>
          </BIMDataButton>
        </template>
      </template>
    </BIMDataMenu>
  </div>
</template>

<script>
import { nextTick, ref } from "vue";
import { MODEL_CONFIG } from "../../../../../config/models.js";
import { FILE_PERMISSION } from "../../../../../config/files.js";
import routeNames from "../../../../../router/route-names.js";
import { isFolder, hasAdminPerm } from "../../../../../utils/file-structure.js";
import {
  isConvertible,
  isIFC,
  isModel,
  isViewable
} from "../../../../../utils/models.js";
import { dropdownPositioner } from "../../../../../utils/positioner.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";
import SetAsModelIcon from "../../../../../components/images/SetAsModelIcon.vue";
import RemoveModelsIcon from "../../../../../components/images/RemoveModelsIcon.vue";

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

    const menuItems = [];

    if (isViewable(props.file)) {
      menuItems.push({
        key: 1,
        text: "FileActionsCell.openViewerButtonText",
        color: "var(--color-primary)",
        icon: "show"
      });
    }

    if (!isFolder(props.file) && isConvertible(props.file)) {
      if (!isModel(props.file)) {
        menuItems.push({
          key: 2,
          text: "FileActionsCell.createModelButtonText",
          component: SetAsModelIcon,
          action: () => onClick("create-model")
        });
      } else {
        menuItems.push({
          key: 3,
          text: "FileActionsCell.removeModelButtonText",
          component: RemoveModelsIcon,
          action: () => onClick("remove-model")
        });
      }
    }

    menuItems.push({
      key: 4,
      text: "FileActionsCell.renameButtonText",
      action: () => onClick("update"),
      icon: "edit",
      disabled:
        !props.project.isAdmin &&
        props.file.user_permission < FILE_PERMISSION.READ_WRITE
    });

    menuItems.push({
      key: 5,
      text: "FileActionsCell.downloadButtonText",
      action: () => onClick("download"),
      icon: "download",
      disabled:
        !props.project.isAdmin &&
        props.file.user_permission < FILE_PERMISSION.READ_WRITE
    });

    if (isFolder(props.file) && props.project.isAdmin) {
      menuItems.push({
        key: 6,
        text: "FileActionsCell.manageAccessButtonText",
        action: () => onClick("manage-access"),
        icon: "key",
        divider: true
      });
    }

    if (!isFolder(props.file) && hasAdminPerm(props.project, props.file)) {
      menuItems.push({
        key: 7,
        text: "FileActionsCell.VisaButtonText",
        icon: "visa",
        action: () => onClick("open-visa-manager"),
        dataTestId: "btn-open-visa-manager"
      });
      menuItems.push({
        key: 8,
        text: "FileActionsCell.addTagsButtonText",
        icon: "tag",
        action: () => onClick("open-tag-manager"),
        dataTestId: "btn-open-tag-manager"
      });
      menuItems.push({
        key: 9,
        text: "FileActionsCell.VersioningButtonText",
        icon: "versioning",
        action: () => onClick("open-versioning-manager"),
        dataTestId: "btn-open-versioning-manager",
        divider: true
      });
    }

    menuItems.push({
      key: 10,
      text: "FileActionsCell.deleteButtonText",
      action: () => onClick("delete"),
      color: "high",
      background: "var(--color-high-lighter)",
      dataTestId: "btn-delete-doc",
      icon: "delete",
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
