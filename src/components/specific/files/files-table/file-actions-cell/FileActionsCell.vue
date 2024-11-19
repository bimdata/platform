<template>
  <div class="file-actions-cell" v-click-away="closeMenu">
    <BIMDataSpinner v-if="loading" />

    <BIMDataButton
      v-else
      data-test-id="btn-actions-cell"
      class="file-actions-cell__btn"
      ripple
      rounded
      icon
      @click="() => (isOpen ? closeMenu() : openMenu())"
    >
      <BIMDataIconEllipsis size="l" />
    </BIMDataButton>

    <BIMDataMenu
      ref="menu"
      class="file-actions-cell__menu"
      v-show="isOpen"
      :menuItems="menuItems"
    >
      <template #item="{ item }">
          <BIMDataButton
            :data-test-id="item.dataTestId"
            width="100%"
            :color="item.color"
            ghost
            squared
            :disabled="item.disabled"
          >
            <div v-if="item.iconComponent" class="m-r-12">
              <component :is="item.iconComponent" width="16px" height="14px" />
            </div>
            <BIMDataIcon v-else :name="item.icon" size="xs" margin="0 12px 0 0" />
            <span>{{ $t(item.text) }}</span>
          </BIMDataButton>
      </template>
    </BIMDataMenu>
  </div>
</template>

<script>
import { nextTick, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "../../../../../state/user.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import {
  isConvertible,
  isConvertibleToPhotosphere,
  isModel,
  isViewable,
  openInViewer
} from "../../../../../utils/models.js";
import { dropdownPositioner } from "../../../../../utils/positioner.js";
// Components
import RemoveModelsIcon from "../../../../../components/images/RemoveModelsIcon.vue";
import SetAsModelIcon from "../../../../../components/images/SetAsModelIcon.vue";

export default {
  props: {
    parent: {
      type: Object
    },
    project: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
  },
  emits: [
    "create-model",
    "create-photosphere",
    "delete",
    "download",
    "file-clicked",
    "manage-access",
    "open-tag-manager",
    "open-versioning-manager",
    "open-visa-manager",
    "remove-model",
    "update",
  ],
  setup(props, { emit }) {
    const router = useRouter();
    const { isProjectAdmin, hasAdminPerm } = useUser();

    const menu = ref(null);
    const isOpen = ref(false);
    const menuItems = shallowRef([]);

    const openMenu = () => {
      if (!props.parent) return;

      isOpen.value = true;

      if (!isFolder(props.file)) {
        menuItems.value.push({
          key: 1,
          icon: "preview",
          text: "FileActionsCell.previewModelButtonText",
          color: "primary",
          action: () => onClick("file-clicked"),
        });
      }

      if (isViewable(props.file)) {
        const { model_id: id, model_type: type } = props.file;
        menuItems.value.push({
          key: 2,
          icon: "show",
          text: "FileActionsCell.openViewerButtonText",
          color: "primary",
          action: () => openInViewer(router, props.project, { id, type }),
        });
      }

      if (!isFolder(props.file) && isConvertible(props.file)) {
        if (!isModel(props.file)) {
          menuItems.value.push({
            key: 3,
            iconComponent: SetAsModelIcon,
            text: "FileActionsCell.createModelButtonText",
            disabled: !hasAdminPerm(props.project, props.file),
            action: () => onClick("create-model")
          });
        } else {
          menuItems.value.push({
            key: 4,
            iconComponent: RemoveModelsIcon,
            text: "FileActionsCell.removeModelButtonText",
            action: () => onClick("remove-model"),
          });
        }
      }

      if (!isFolder(props.file) && isConvertibleToPhotosphere(props.file)) {
        if (!isModel(props.file)) {
          menuItems.value.push({
            key: 3,
            iconComponent: SetAsModelIcon,
            text: "FileActionsCell.createPhotosphereButtonText",
            disabled: !hasAdminPerm(props.project, props.file),
            action: () => onClick("create-photosphere")
          });
        }
      }

      menuItems.value.push({
        key: 5,
        icon: "edit",
        text: "t.rename",
        disabled: !hasAdminPerm(props.project, props.file),
        action: () => onClick("update"),
      });

      menuItems.value.push({
        key: 6,
        icon: "download",
        text: "t.download",
        action: () => onClick("download"),
      });

      if (isFolder(props.file) && isProjectAdmin(props.project)) {
        menuItems.value.push({
          key: 7,
          icon: "key",
          text: "FileActionsCell.manageAccessButtonText",
          action: () => onClick("manage-access"),
          divider: true,
        });
      }

      if (!isFolder(props.file) && hasAdminPerm(props.project, props.file)) {
        menuItems.value.push({
          key: 8,
          icon: "visa",
          text: "FileActionsCell.visaButtonText",
          action: () => onClick("open-visa-manager"),
          dataTestId: "btn-open-visa-manager",
        });
        menuItems.value.push({
          key: 9,
          icon: "tag",
          text: "FileActionsCell.addTagsButtonText",
          action: () => onClick("open-tag-manager"),
          dataTestId: "btn-open-tag-manager",
        });
        menuItems.value.push({
          key: 10,
          icon: "versioning",
          text: "FileActionsCell.versioningButtonText",
          action: () => onClick("open-versioning-manager"),
          divider: true,
          dataTestId: "btn-open-versioning-manager",
        });
      }

      menuItems.value.push({
        key: 11,
        icon: "delete",
        text: "t.delete",
        color: "high",
        background: "var(--color-high-lighter)",
        disabled: !hasAdminPerm(props.project, props.file),
        action: () => onClick("delete"),
        dataTestId: "btn-delete-doc",
      });

      nextTick(() => {
        if (props.parent) {
          menu.value.$el.style.top = dropdownPositioner(
            props.parent.$el,
            menu.value.$el
          );
        }
      });
    };

    const closeMenu = () => {
      isOpen.value = false;
      menuItems.value = [];
      nextTick(() => (menu.value.$el.style.top = ""));
    };

    const onClick = event => {
      closeMenu();
      emit(event);
    };

    return {
      // References
      menu,
      isOpen,
      menuItems,
      // Methods
      closeMenu,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
