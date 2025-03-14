<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <template v-if="model.type === MODEL_TYPE.META_BUILDING">
      <BIMDataButton
        color="primary"
        outline
        radius
        icon
        @click="onClick('view-metaBuilding')"
      >
        <BIMDataIconStructure size="s" />
      </BIMDataButton>
    </template>

    <template v-if="model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING">
      <BIMDataButton
        color="primary"
        outline
        radius
        icon
        @click="onClick('view-photosphereBuilding')"
      >
        <BIMDataIconStructure size="s" />
      </BIMDataButton>
    </template>

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
        model.type === MODEL_TYPE.JPEG ||
        model.type === MODEL_TYPE.META_BUILDING ||
        model.type === MODEL_TYPE.PDF ||
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

    <template
      v-else-if="
        model.type === MODEL_TYPE.PHOTOSPHERE ||
        model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING
      "
    >
      <ViewerButton
        :disabled="!isModelReady"
        :project="project"
        :model="model"
        :window="WINDOWS.PHOTOSPHERE"
        text="2D"
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
        <BIMDataIconDownload size="m" />
      </BIMDataButton>
    </template>

    <template v-if="!isProjectGuest(project)">
      <BIMDataButton
        class="model-actions-cell__btn"
        data-test-id="btn-toggle-menu"
        :disabled="!hasAdminPerm(project, model.document)"
        ripple
        rounded
        icon
        @click="toggleMenu"
      >
        <BIMDataIconEllipsis size="l" />
      </BIMDataButton>

      <transition name="fade">
        <BIMDataMenu
          :menuItems="menuItems"
          class="model-actions-cell__menu"
          v-show="showMenu"
          width="180px"
        >
          <template #item="{ item }">
            <BIMDataIcon :name="item.icon" size="xs" margin="0 12px 0 0" />
            <span :data-test-id="item.dataTestId">
              {{ $t(item.text) }}
            </span>
          </template>
        </BIMDataMenu>
      </transition>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";
import { useToggle } from "../../../../../composables/toggle.js";
import { MODEL_STATUS, MODEL_TYPE } from "../../../../../config/models.js";
import { WINDOWS } from "../../../../../config/viewer.js";
import { useUser } from "../../../../../state/user.js";
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
  emits: [
    "archive",
    "delete",
    "download",
    "edit-metaBuilding",
    "edit-photosphereBuilding",
    "update",
    "view-metaBuilding",
    "view-photosphereBuilding",
  ],
  setup(props, { emit }) {
    const { isProjectGuest, hasAdminPerm } = useUser();

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

    const menuItems = [];
    if (props.model.document) {
      menuItems.push({
        key: 1,
        text: "t.rename",
        icon: "edit",
        action: () => onClick("update"),
        color: "var(--color-primary)",
        dataTestId: "btn-update-model"
      });
    }

    if (props.model.type === MODEL_TYPE.META_BUILDING) {
      menuItems.push({
        key: 3,
        text: "t.edit",
        icon: "edit",
        action: () => onClick("edit-metaBuilding"),
        color: "var(--color-primary)"
      });
    }

    if (props.model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING) {
      menuItems.push({
        key: 3,
        text: "t.edit",
        icon: "edit",
        action: () => onClick("edit-photosphereBuilding"),
        color: "var(--color-primary)"
      });
    }

    menuItems.push({
      key: 2,
      text: props.model.archived ? "t.unarchive" : "t.archive",
      icon: props.model.archived ? "unarchive" : "archive",
      action: () => onClick(props.model.archived ? "unarchive" : "archive"),
      color: "var(--color-primary)",
      dataTestId: "btn-archive-model"
    });

    menuItems.push({
      divider: true
    });

    menuItems.push({
      key: 4,
      text: "t.delete",
      icon: "delete",
      action: () => onClick("delete"),
      color: "var(--color-high)",
      background: "var(--color-high-lighter)",
      dataTestId: "btn-delete-model"
    });

    return {
      // References
      hasAdminPerm,
      isModelReady,
      menuItems,
      MODEL_TYPE,
      showMenu,
      WINDOWS,
      // Methods
      closeMenu,
      isProjectGuest,
      onClick,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
