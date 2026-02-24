<template>
  <div class="model-actions-cell" v-click-away="closeMenu">
    <template v-if="model.type === MODEL_TYPE.META_BUILDING">
      <BIMDataButton color="primary" outline radius icon @click="onClick('view-metaBuilding')">
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
        model.type === MODEL_TYPE.PHOTOSPHERE || model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING
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
        @click="() => (isOpen ? closeMenu() : openMenu())"
      >
        <BIMDataIconEllipsis size="l" />
      </BIMDataButton>

      <BIMDataMenu
        ref="menu"
        :menuItems="menuItems"
        class="model-actions-cell__menu"
        v-show="isOpen"
        width="180px"
      >
        <template #item="{ item }">
          <BIMDataIcon :name="item.icon" size="xs" margin="0 12px 0 0" />
          <span :data-test-id="item.dataTestId">
            {{ $t(item.text) }}
          </span>
        </template>
      </BIMDataMenu>
    </template>
  </div>
</template>

<script>
import { ref, computed, nextTick } from "vue";
import { MODEL_STATUS, MODEL_TYPE } from "../../../../../config/models.js";
import { WINDOWS } from "../../../../../config/viewer.js";
import { useUser } from "../../../../../state/user.js";
import { dropdownPositioner } from "../../../../../utils/positioner.js";
// Components
import ViewerButton from "./ViewerButton.vue";

export default {
  components: {
    ViewerButton,
  },
  props: {
    parent: {
      type: Object,
    },
    project: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
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

    const menu = ref(null);
    const isOpen = ref(false);
    const isModelReady = computed(() => MODEL_STATUS.COMPLETED === props.model.status);

    const menuItems = ref([]);
    const openMenu = () => {
      if (!props.parent) return;

      isOpen.value = true;
      if (props.model.document) {
        menuItems.value.push({
          key: 1,
          text: "t.rename",
          icon: "edit",
          action: () => onClick("update"),
          color: "var(--color-primary)",
          dataTestId: "btn-update-model",
        });
      }

      if (props.model.type === MODEL_TYPE.META_BUILDING) {
        menuItems.value.push({
          key: 3,
          text: "t.edit",
          icon: "edit",
          action: () => onClick("edit-metaBuilding"),
          color: "var(--color-primary)",
        });
      }

      if (props.model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING) {
        menuItems.value.push({
          key: 3,
          text: "t.edit",
          icon: "edit",
          action: () => onClick("edit-photosphereBuilding"),
          color: "var(--color-primary)",
        });
      }

      menuItems.value.push({
        key: 2,
        text: props.model.archived ? "t.unarchive" : "t.archive",
        icon: props.model.archived ? "unarchive" : "archive",
        action: () => onClick(props.model.archived ? "unarchive" : "archive"),
        color: "var(--color-primary)",
        dataTestId: "btn-archive-model",
      });

      menuItems.value.push({
        divider: true,
      });

      menuItems.value.push({
        key: 4,
        text: "t.delete",
        icon: "delete",
        action: () => onClick("delete"),
        color: "var(--color-high)",
        background: "var(--color-high-lighter)",
        dataTestId: "btn-delete-model",
      });

      nextTick(() => {
        if (props.parent) {
          menu.value.$el.style.top = dropdownPositioner(props.parent.$el, menu.value.$el);
        }
      });
    };

    const closeMenu = () => {
      isOpen.value = false;
      menuItems.value = [];
      nextTick(() => (menu.value.$el.style.top = ""));
    };

    const onClick = (event) => {
      closeMenu();
      emit(event, props.model);
    };

    return {
      // References
      menu,
      isOpen,
      hasAdminPerm,
      isModelReady,
      menuItems,
      MODEL_TYPE,
      WINDOWS,
      // Methods
      closeMenu,
      isProjectGuest,
      onClick,
      openMenu,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelActionsCell.scss"></style>
