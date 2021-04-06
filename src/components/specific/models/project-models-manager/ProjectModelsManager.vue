<template>
  <BIMDataCard
    class="project-models-manager"
    :titleHeader="$t('ProjectBoard.ProjectModelsManager.title')"
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
import ModelsActionBar from "@/components/specific/models/models-action-bar/ModelsActionBar";
import ModelsManagerTable from "@/components/specific/models/models-manager-table/ModelsManagerTable";
import ModelsDeleteModal from "./models-delete-modal/ModelsDeleteModal";
import ModelsMergeModal from "./models-merge-modal/ModelsMergeModal";

export default {
  components: {
    BIMDataCard,
    BIMDataTabs,
    ModelsActionBar,
    ModelsManagerTable,
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
          label: t("ProjectBoard.ProjectModelsManager.tabs.ifc")
        },
        {
          id: "split",
          label: t("ProjectBoard.ProjectModelsManager.tabs.split")
        },
        {
          id: "merge",
          label: t("ProjectBoard.ProjectModelsManager.tabs.merge")
        },
        {
          id: "archive",
          label: t("ProjectBoard.ProjectModelsManager.tabs.archive")
        }
      ];
    });
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    const models = reactive({
      ifc: [],
      merge: [],
      split: [],
      archive: []
    });
    watch(
      () => props.models,
      () => {
        models.ifc = props.models.filter(model =>
          [MODEL_SOURCE.UPLOAD, MODEL_SOURCE.OPTIMIZED].includes(model.source)
        );
        models.merge = props.models.filter(
          model => model.source === MODEL_SOURCE.MERGE
        );
        models.split = props.models.filter(model =>
          [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
        );
        models.archive = props.models.filter(model => model.archived);
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
      // TODO: fix model update (maybe on API side)
      for (const model of models) {
        model.archived = true;
      }
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
