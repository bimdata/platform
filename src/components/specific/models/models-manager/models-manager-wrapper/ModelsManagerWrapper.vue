<template>
  <div class="models-manager-wrapper">
    <BIMDataTabs
      width="100%"
      height="38px"
      tabSize="120px"
      :tabs="tabs"
      :selected="currentTab.id"
      @tab-click="selectTab"
    >
      <template #tab="{ tab }">
        <span class="models-manager-wrapper__tab-label">
          {{ $t(`ModelsManager.tabs.${tab.label}`) }}
        </span>
        <span
          class="models-manager-wrapper__tab-count"
          v-if="tab.models.length > 0"
        >
          {{ tab.models.length }}
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
      :allModelsCounter="allModelsCounter"
      :modelType="modelType"
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
import { ref, watch, watchEffect } from "vue";
import { useModels } from "../../../../../state/models.js";
// Components
import ModelsActionBar from "../models-action-bar/ModelsActionBar.vue";
import ModelsDeleteModal from "../models-delete-modal/ModelsDeleteModal.vue";
import ModelsTable from "../models-table/ModelsTable.vue";

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
    tabs: {
      type: Array,
      required: true,
      validator: value => value.length > 0
    },
    modelType: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const { downloadModels: download, updateModels } = useModels();

    const currentTab = ref({});
    const selectTab = tab => (currentTab.value = tab);

    watch(
      () => props.tabs,
      () => {
        currentTab.value =
          props.tabs.find(tab => tab.id === currentTab.value?.id) ||
          props.tabs[0];
      },
      { immediate: true }
    );

    const displayedModels = ref([]);
    watchEffect(() => {
      displayedModels.value = currentTab.value.models;
    });

    const allModelsCounter = ref(0);
    watchEffect(() => {
      allModelsCounter.value = props.tabs.reduce(
        (a, b) => a + b.models.length,
        0
      );
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
      modelsToDelete,
      selection,
      showDeleteModal,
      allModelsCounter,
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

<style scoped lang="scss" src="./ModelsManagerWrapper.scss"></style>
