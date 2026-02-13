<template>
  <GenericModelsManager
    class="photosphere-manager"
    :project="project"
    :types="types"
    :tabs="tabs"
    @tab-changed="currentTab = $event"
    :file-upload-params="{ processHint: 'PHOTOSPHERE' }"
    @file-uploaded="$emit('file-uploaded')"
    @view-photosphereBuilding="viewMetaBuilding"
    @edit-photosphereBuilding="editMetaBuilding"
  >
    <template #content v-if="currentTab?.id === 'photosphereBuildings'">
      <BIMDataButton
        v-if="!isProjectGuest(project)"
        class="photosphere-manager__building-maker-btn"
        width="100px"
        color="primary"
        outline
        radius
        icon
        @click="openBuildingMaker"
      >
        <BIMDataIconBuilding size="xs" margin="0 12px 0 0" />
        <span> {{ $t("t.create") }} </span>
      </BIMDataButton>
    </template>
  </GenericModelsManager>
</template>

<script>
import { h, ref, watch } from "vue";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useUser } from "../../../../../state/user.js";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";
import PhotosphereBuildingMakerPanel from "./PhotosphereBuildingMakerPanel.vue";
import PhotosphereBuildingPanel from "./PhotosphereBuildingPanel.vue";

const tabsDef = [{ id: "upload" }, { id: "photosphereBuildings" }, { id: "archive" }];

export default {
  components: {
    GenericModelsManager,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
  },
  emits: ["file-uploaded"],
  setup(props) {
    const { openSidePanel, closeSidePanel } = useAppSidePanel();
    const { isProjectGuest } = useUser();

    const tabs = ref(tabsDef);
    const currentTab = ref(null);

    const openBuildingMaker = () => {
      openSidePanel("right", {
        component: {
          render() {
            return h(PhotosphereBuildingMakerPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
            });
          },
        },
      });
    };

    const viewMetaBuilding = (model) => {
      openSidePanel("right", {
        component: {
          render() {
            return h(PhotosphereBuildingPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
              model,
            });
          },
        },
      });
    };

    const editMetaBuilding = (model) => {
      openSidePanel("right", {
        component: {
          render() {
            return h(PhotosphereBuildingMakerPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
              model,
            });
          },
        },
      });
    };

    watch(
      () => props.models,
      (models) => {
        const modelsBySource = segregateBySource(
          models.filter((model) => model.type !== MODEL_TYPE.PHOTOSPHERE_BUILDING),
        );
        const buildings = models.filter((model) => model.type === MODEL_TYPE.PHOTOSPHERE_BUILDING);
        tabs.value = tabs.value.map((tab) => ({
          ...tab,
          label: tab.label || tab.id,
          models: tab.id === "photosphereBuildings" ? buildings : modelsBySource[tab.id],
        }));
      },
      { immediate: true },
    );

    return {
      // References
      currentTab,
      tabs,
      // Methods
      editMetaBuilding,
      isProjectGuest,
      openBuildingMaker,
      viewMetaBuilding,
    };
  },
};
</script>

<style scoped>
.photosphere-manager {
  .photosphere-manager__building-maker-btn {
    position: absolute;
    top: 3px;
    right: 124px;
  }
}
</style>
