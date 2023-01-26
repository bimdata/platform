<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <template v-if="model.type === MODEL_TYPE.IFC">
      <template v-for="window of [WINDOWS.IFC2D, WINDOWS.IFC3D]" :key="window">
        <ViewerButton
          :disabled="!isModelReady"
          :project="project"
          :model="model"
          :window="window"
        />
      </template>
    </template>

    <template v-else-if="model.type === MODEL_TYPE.DWG">
      <ViewerButton
        :disabled="!isModelReady"
        :project="project"
        :model="model"
        :window="WINDOWS.DWG"
        text="2D"
      />
    </template>

    <template v-else-if="model.type === MODEL_TYPE.DXF">
      <ViewerButton
        :disabled="!isModelReady"
        :project="project"
        :model="model"
        :window="WINDOWS.DXF"
        text="2D"
      />
    </template>

    <template
      v-else-if="
        model.type === MODEL_TYPE.PDF ||
        model.type === MODEL_TYPE.META_BUILDING ||
        model.type === MODEL_TYPE.JPEG ||
        model.type === MODEL_TYPE.PNG
      "
    >
      <ViewerButton
        :disabled="!isModelReady"
        :project="project"
        :model="model"
        :window="WINDOWS.PLAN"
        text="2D"
      />
    </template>

    <template v-else-if="model.type === MODEL_TYPE.POINT_CLOUD">
      <ViewerButton
        :disabled="!isModelReady"
        :project="project"
        :model="model"
        :window="WINDOWS.POINT_CLOUD"
        text="3D"
      />
    </template>

    <template v-if="model.document">
      <BIMDataButton
        class="model-actions-cell__btn"
        data-test-id="btn-download-model"
        ripple
        rounded
        icon
        @click="onClick('download')"
      >
        <BIMDataIcon name="download" size="m" />
      </BIMDataButton>
    </template>

    <BIMDataButton
      class="model-actions-cell__btn"
      data-test-id="btn-toggle-menu"
      :disabled="!project.isAdmin && model.document?.user_permission < 100"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <BIMDataMenu
        :menuItems="menuItems"
        class="model-actions-cell__menu"
        v-show="showMenu"
        width="180px"
      />
    </transition>
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToggle } from "../../../../../../composables/toggle.js";
import { MODEL_STATUS, MODEL_TYPE } from "../../../../../../config/models.js";
import { WINDOWS } from "../../../../../../config/viewer.js";
// Components
import ViewerButton from "./ViewerButton.vue";

export default {
  components: {
    ViewerButton
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
  emits: ["archive", "delete", "download", "update", "edit-metaBuilding"],
  setup(props, { emit }) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const isModelReady = computed(
      () => MODEL_STATUS.COMPLETED === props.model.status
    );

    const onClick = event => {
      closeMenu();
      emit(event, props.model);
    };

    const { t } = useI18n();

    const menuItems = [];

    if (props.model.document) {
      menuItems.push({
        key: 1,
        get text() {
          return t("ModelActionsCell.renameButtonText");
        },
        action: () => onClick("update"),
        color: "var(--color-primary)"
      });
    }

    menuItems.push({
      key: 2,
      get text() {
        return props.model.archived
          ? t("ModelActionsCell.unarchiveButtonText")
          : t("ModelActionsCell.archiveButtonText");
      },
      action: () => onClick(props.model.archived ? "unarchive" : "archive"),
      color: "var(--color-primary)"
    });

    if (props.model.type === MODEL_TYPE.META_BUILDING) {
      menuItems.push({
        key: 3,
        get text() {
          return t("ModelActionsCell.editButtontext");
        },
        action: () => onClick("edit-metaBuilding"),
        color: "var(--color-primary)"
      });
    }

    menuItems.push({
      key: 4,
      get text() {
        return t("ModelActionsCell.deleteButtonText");
      },
      action: () => onClick("delete"),
      color: "var(--color-high)",
      background: "var(--color-high-lighter)"
    });

    return {
      // References
      isModelReady,
      MODEL_TYPE,
      showMenu,
      WINDOWS,
      menuItems,
      // Methods
      closeMenu,
      onClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
