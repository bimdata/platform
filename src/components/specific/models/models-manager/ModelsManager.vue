<template>
  <BIMDataCard class="models-manager" :titleHeader="$t('ModelsManager.title')">
    <template #content>
      <BIMDataTabs
        width="100%"
        height="44px"
        tabSize="180px"
        :tabs="tabs"
        :selected="currentTab"
        @tab-click="selectTab"
      >
        <template #tab="{ tab }">
          <span class="models-manager__tab-label">
            {{ tab.label }}
          </span>
          <span
            class="models-manager__tab-count"
            v-if="models[tab.id].length > 0"
          >
            {{ models[tab.id].length }}
          </span>
        </template>
      </BIMDataTabs>

      <transition name="fade">
        <ModelsActionBar
          v-show="selection.length > 0"
          class="models-manager__action-bar"
          :currentTab="currentTab"
          :models="selection"
          @archive="archiveModels"
          @delete="openDeleteModal"
          @download="downloadModels"
          @merge="openMergeModal"
          @unarchive="unarchiveModels"
        />
      </transition>

      <ModelsTable
        :project="project"
        :models="displayedModels"
        @archive="archiveModels([$event])"
        @delete="openDeleteModal([$event])"
        @download="downloadModels([$event])"
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
import { downloadAll } from "@/utils/download";
import { segregate } from "@/utils/models";
// Components
import ModelsTable from "@/components/specific/models/models-table/ModelsTable";
import ModelsActionBar from "./models-action-bar/ModelsActionBar";
import ModelsDeleteModal from "./models-delete-modal/ModelsDeleteModal";
import ModelsMergeModal from "./models-merge-modal/ModelsMergeModal";

const tabsDef = [
  { id: "ifc" },
  { id: "split" },
  { id: "merge" },
  { id: "archive" }
];

export default {
  components: {
    ModelsTable,
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
    const { locale, t } = useI18n();
    const { updateModels } = useModels();

    const tabs = ref([]);
    const currentTab = ref(tabsDef[0].id);
    const selectTab = tab => {
      currentTab.value = tab.id;
    };
    watch(
      () => locale.value,
      () => {
        tabs.value = tabsDef.map(tab => ({
          ...tab,
          label: t(`ModelsManager.tabs.${tab.id}`)
        }));
      },
      { immediate: true }
    );

    const models = reactive({
      ifc: [],
      split: [],
      merge: [],
      archive: []
    });
    const displayedModels = ref([]);
    watch(
      () => props.models,
      () => Object.assign(models, segregate(props.models)),
      { immediate: true }
    );
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

    const unarchiveModels = async models => {
      models = models.map(model => ({ ...model, archived: false }));
      await updateModels(props.project, models);
    };

    const downloadModels = async models => {
      await downloadAll(
        models.map(model => ({
          name: model.document.fileName,
          url: model.document.file
        }))
      );
    };

    return {
      // References
      currentTab,
      displayedModels,
      models,
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
      setSelection,
      unarchiveModels
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsManager.scss"></style>
