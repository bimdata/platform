<template>
  <div class="ifc-manager">
    <BIMDataTabs
      width="100%"
      height="38px"
      tabSize="120px"
      :tabs="tabs"
      :selected="currentTab"
      @tab-click="selectTab"
    >
      <template #tab="{ tab }">
        <span class="ifc-manager__tab-label">
          {{ tab.label }}
        </span>
        <span
          class="ifc-manager__tab-count"
          v-if="modelLists[tab.id].length > 0"
        >
          {{ modelLists[tab.id].length }}
        </span>
      </template>
    </BIMDataTabs>

    <div class="ifc-manager__separator"></div>

    <transition name="fade">
      <IFCActionBar
        class="ifc-manager__action-bar"
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

    <IFCTable
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
  </div>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models.js";
import { segregateBySource } from "@/utils/models.js";
// Components
import ModelsDeleteModal from "@/components/specific/models/models-manager/models-delete-modal/ModelsDeleteModal.vue";
import IFCActionBar from "./ifc-action-bar/IFCActionBar.vue";
import IFCTable from "./ifc-table/IFCTable.vue";

const tabsDef = [{ id: "ifc" }, { id: "split" }, { id: "archive" }];

export default {
  components: {
    IFCActionBar,
    IFCTable,
    ModelsDeleteModal
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
    const { updateModels, downloadModels: download } = useModels();

    const tabs = ref([]);
    const currentTab = ref(tabsDef[0].id);
    const selectTab = tab => (currentTab.value = tab.id);
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

    const modelLists = reactive({
      ifc: [],
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
      selectTab,
      setSelection,
      unarchiveModels
    };
  }
};
</script>

<style scoped lang="scss" src="./IFCManager.scss"></style>
