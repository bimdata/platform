<template>
  <BIMDataCard
    class="project-models-manager"
    :titleHeader="$t('ProjectModelsManager.title')"
  >
    <template #content>
      <BIMDataTabs
        width="100%"
        height="44px"
        tabSize="180px"
        :tabs="tabs"
        selected="ifc"
        @tab-click="selectTab"
      />

      <ModelsActionBar
        class="project-models-manager__action-bar"
        :style="{ visibility: selection.length > 0 ? 'visible' : 'hidden' }"
        :models="selection"
        @archive-clicked="archiveModels"
        @delete-clicked="openDeleteModal"
        @download-clicked="downloadModels"
        @merge-clicked="openMergeModal"
      />

      <ModelsManagerTable
        :project="project"
        :models="displayedModels"
        @archive-clicked="archiveModels([$event])"
        @delete-clicked="openDeleteModal([$event])"
        @download-clicked="downloadModels([$event])"
        @selection-changed="setSelection"
      />

      <transition name="fade">
        <ModelsDeleteModal
          v-if="showDeleteModal"
          :project="project"
          :models="modelsToDelete"
          @close="closeDeleteModal"
        />
      </transition>

      <transition name="fade">
        <ModelsMergeModal
          v-if="showMergeModal"
          :project="project"
          :models="modelsToMerge"
          @close="closeMergeModal"
        />
      </transition>
    </template>
  </BIMDataCard>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models";
import { MODEL_SOURCE } from "@/utils/models";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ModelsManagerTable from "@/components/specific/models/models-manager-table/ModelsManagerTable";
import ModelsActionBar from "./models-action-bar/ModelsActionBar";
import ModelsDeleteModal from "./models-delete-modal/ModelsDeleteModal";
import ModelsMergeModal from "./models-merge-modal/ModelsMergeModal";

export default {
  components: {
    BIMDataCard,
    BIMDataTabs,
    ModelsManagerTable,
    ModelsActionBar,
    ModelsDeleteModal,
    ModelsMergeModal
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const { updateModels } = useModels();

    const tabs = ref([]);
    const currentTab = ref("ifc");
    watchEffect(() => {
      tabs.value = [
        {
          id: "ifc",
          label: t("ProjectModelsManager.tabs.ifc")
        },
        {
          id: "split",
          label: t("ProjectModelsManager.tabs.split")
        },
        {
          id: "merge",
          label: t("ProjectModelsManager.tabs.merge")
        },
        {
          id: "archive",
          label: t("ProjectModelsManager.tabs.archive")
        }
      ];
    });
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    const models = reactive({
      ifc: [],
      split: [],
      merge: [],
      archive: []
    });
    watch(
      () => props.models,
      () => {
        const filteredModels = {
          ifc: [],
          split: [],
          merge: [],
          archive: []
        };
        for (const model of props.models) {
          if (model.archived) {
            filteredModels.archive.push(model);
          } else if (
            [MODEL_SOURCE.UPLOAD, MODEL_SOURCE.OPTIMIZED].includes(model.source)
          ) {
            filteredModels.ifc.push(model);
          } else if (
            [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
          ) {
            filteredModels.split.push(model);
          } else if (MODEL_SOURCE.MERGE === model.source) {
            filteredModels.merge.push(model);
          } else {
            filteredModels.ifc.push(model);
          }
        }
        Object.assign(models, filteredModels);
      },
      { immediate: true }
    );

    const displayedModels = ref([]);
    watchEffect(() => {
      displayedModels.value = models[currentTab.value];
    });

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    const modelsToDelete = ref([]);
    const showDeleteModal = ref(false);
    const openDeleteModal = models => {
      modelsToDelete.value = models;
      showDeleteModal.value = true;
    };
    const closeDeleteModal = () => {
      modelsToDelete.value = [];
      showDeleteModal.value = false;
    };

    const modelsToMerge = ref([]);
    const showMergeModal = ref(false);
    const openMergeModal = models => {
      modelsToMerge.value = models;
      showMergeModal.value = true;
    };
    const closeMergeModal = () => {
      modelsToMerge.value = [];
      showMergeModal.value = false;
    };

    const archiveModels = async models => {
      models = models.map(model => ({ ...model, archived: true }));
      await updateModels(props.project, models);
    };

    const downloadModels = models => {
      // TODO: fix download for multiple files
      const link = document.createElement("a");
      link.style.display = "none";
      link.download = "";
      document.body.appendChild(link);
      for (const model of models) {
        link.href = model.document.file;
        link.click();
      }
      document.body.removeChild(link);
    };

    return {
      // References
      displayedModels,
      modelsToDelete,
      modelsToMerge,
      selection,
      showDeleteModal,
      showMergeModal,
      tabs,
      // Methods
      archiveModels,
      downloadModels,
      closeDeleteModal,
      closeMergeModal,
      openDeleteModal,
      openMergeModal,
      selectTab,
      setSelection
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
