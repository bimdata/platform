<template>
  <GenericModelsManager
    :project="project"
    :types="types"
    :tabs="tabs"
    @file-uploaded="$emit('file-uploaded')"
    @view-photosphereBuilding="viewPhotosphereBuilding"
  />
</template>

<script>
import { ref, watch } from "vue";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";
import PhotosphereBuildingPanel from "./PhotosphereBuildingPanel.vue";

const tabsDef = [{ id: "upload" }, { id: "archive" }];

export default {
  components: {
    GenericModelsManager
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    },
    types: {
      type: Array,
      required: true
    }
  },
  emits: ["file-uploaded"],
  setup(props) {
    const { openSidePanel, closeSidePanel } = useAppSidePanel();

    const tabs = ref(tabsDef);

    const viewPhotosphereBuilding = model => {
      openSidePanel("right", {
        component: {
          render() {
            return h(PhotosphereBuildingPanel, {
              onClose: closeSidePanel,
              space: props.project.cloud,
              project: props.project,
              model,
            })
          }
        }
      });
    };

    watch(
      () => props.models,
      models => {
        const modelsBySource = segregateBySource(models);
        tabs.value = tabs.value.map(tab => ({
          ...tab,
          label: tab.label || tab.id,
          models: modelsBySource[tab.id]
        }));
      },
      { immediate: true }
    );

    return {
      tabs,
      viewPhotosphereBuilding
    };
  }
};
</script>
