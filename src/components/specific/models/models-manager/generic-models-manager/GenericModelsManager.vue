<template>
  <div class="generic-models-manager">
    <BIMDataTabs
      width="100%"
      height="38px"
      tabSize="120px"
      :tabs="tabs"
      :selected="currentTab.id"
      @tab-click="selectTab"
    >
      <template #tab="{ tab }">
        <span class="generic-models-manager__tab-label">
          {{ $t(`ModelsManager.tabs.${tab.label}`) }}
        </span>
        <span
          class="generic-models-manager__tab-count"
          v-if="tab.models.length > 0"
        >
          {{ tab.models.length }}
        </span>
      </template>
    </BIMDataTabs>

    <div class="generic-models-manager__separator"></div>

    <transition name="fade">
      <ModelsActionBar
        class="generic-models-manager__action-bar"
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
      class="generic-models-manager__table"
      :project="project"
      :models="displayedModels"
      @archive="archiveModels([$event])"
      @delete="openDeleteModal([$event])"
      @download="downloadModels([$event])"
      @selection-changed="setSelection"
      @unarchive="unarchiveModels([$event])"
      @edit="$emit('edit', $event)"
    >
      <template #placeholder>
        <slot name="tablePlaceholder"></slot>
      </template>
    </ModelsTable>

    <transition name="fade">
      <ModelsDeleteModal
        v-if="showDeleteModal"
        :project="project"
        :models="modelsToDelete"
        @close="closeDeleteModal"
      />
    </transition>

    <slot name="content"></slot>
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
    }
  },
  emits: ["edit", "get-current-tab"],
  setup(props, { emit }) {
    const { downloadModels: download, updateModels } = useModels();

    const currentTab = ref({});
    const selectTab = tab => {
      currentTab.value = tab;
      emit("get-current-tab", tab);
    };

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

<style scoped lang="scss" src="./GenericModelsManager.scss"></style>
