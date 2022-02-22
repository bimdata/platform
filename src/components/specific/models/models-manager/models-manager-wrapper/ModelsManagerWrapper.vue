<template>
  <div class="models-manager-wrapper">
    <BIMDataTabs
      width="100%"
      height="38px"
      tabSize="120px"
      :tabs="tabs"
      :selected="currentTab"
      @tab-click="selectTab"
    >
      <template #tab="{ tab }">
        <span class="models-manager-wrapper__tab-label">
          {{ tab.label }}
        </span>
        <span
          class="models-manager-wrapper__tab-count"
          v-if="modelLists[tab.id].length > 0"
        >
          {{ modelLists[tab.id].length }}
        </span>
      </template>
    </BIMDataTabs>

    <div class="models-manager-wrapper__separator"></div>

    <transition name="fade">
      <ModelsActionBar
        class="models-manager-wrapper__action-bar"
        v-show="selection.length > 0"
        :project="project"
        :models="selection"
        :currentTab="currentTab"
        @archive="archiveModels"
        @delete="openDeleteModal"
        @download="downloadModels"
        @unarchive="unarchiveModels"
      />
    </transition>

    <ModelsTable
      class="models-manager-wrapper__table"
      :project="project"
      :models="displayedModels"
      @archive="archiveModels([$event])"
      @delete="openDeleteModal([$event])"
      @download="downloadModels([$event])"
      @remove-model="removeModel($event)"
      @selection-changed="setSelection"
      @unarchive="unarchiveModels([$event])"
    />

    <transition name="fade">
      <ModelsDeleteModal
        v-if="showDeleteModal"
        :project="project"
        :models="modelsToDelete"
        @close="closeDeleteModal"
      />
    </transition>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models.js";
import { segregateBySource } from "@/utils/models.js";
// Components
import ModelsActionBar from "../models-action-bar/ModelsActionBar.vue";
import ModelsDeleteModal from "../models-delete-modal/ModelsDeleteModal.vue";
import ModelsTable from "../models-table/ModelsTable.vue";

const tabsDef = {
  DWG: [{ id: "upload" }, { id: "archive" }],
  IFC: [{ id: "upload" }, { id: "split" }, { id: "archive" }],
  PDF: [{ id: "upload" }, { id: "archive" }]
};

export default {
  components: {
    ModelsActionBar,
    ModelsDeleteModal,
    ModelsTable
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
    modelType: {
      type: String,
      default: "IFC",
      validator: value => ["DWG", "IFC", "PDF"].includes(value)
    }
  },
  setup(props) {
    const { t } = useI18n();
    const {
      deleteModels,
      downloadModels: download,
      updateModels
    } = useModels();

    const tabs = computed(() =>
      tabsDef[props.modelType].map(tab => ({
        ...tab,
        label: t(`ModelsManager.tabs.${tab.id}`)
      }))
    );
    const currentTab = ref(tabs.value[0].id);
    const selectTab = tab => (currentTab.value = tab.id);

    const modelLists = reactive({
      upload: [],
      split: [],
      archive: []
    });
    const displayedModels = ref([]);
    watch(
      () => props.models,
      () => Object.assign(modelLists, segregateBySource(props.models)),
      { immediate: true }
    );
    watchEffect(() => {
      displayedModels.value = modelLists[currentTab.value];
    });

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    const archiveModels = async models => {
      await updateModels(
        props.project,
        models.map(model => ({ ...model, archived: true }))
      );
    };

    const unarchiveModels = async models => {
      await updateModels(
        props.project,
        models.map(model => ({ ...model, archived: false }))
      );
    };

    const removeModel = async model => {
      await deleteModels(props.project, [model]);
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

    const downloadModels = async models => {
      await download(models);
    };

    return {
      // References
      currentTab,
      displayedModels,
      modelLists,
      modelsToDelete,
      selection,
      showDeleteModal,
      tabs,
      // Methods
      archiveModels,
      downloadModels,
      closeDeleteModal,
      openDeleteModal,
      removeModel,
      selectTab,
      setSelection,
      unarchiveModels
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsManagerWrapper.scss"></style>
