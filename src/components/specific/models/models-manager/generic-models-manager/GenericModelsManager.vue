<template>
  <div class="generic-models-manager">
    <div class="flex items-center justify-between">
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
          <span class="generic-models-manager__tab-count" v-if="tab.models.length > 0">
            {{ tab.models.length }}
          </span>
        </template>
      </BIMDataTabs>

      <BIMDataSearch
        :placeholder="$t('t.search')"
        v-model="searchText"
        color="primary"
        radius
        clear
        width="200px"
        height="32px"
        class="generic-models-manager__search m-r-12"
        :style="{
          right:
            currentTab?.id === 'photosphereBuildings' || currentTab?.id === 'metaBuildings'
              ? '112px'
              : '0',
        }"
      />

      <BIMDataButton
        v-if="!isProjectGuest(project)"
        class="generic-models-manager__btn-add m-r-12"
        color="primary"
        width="100px"
        fill
        radius
        icon
        @click="uploadModels"
      >
        <BIMDataIconExport margin="0 12px" />
        <span> {{ $t("t.add") }}</span>
      </BIMDataButton>
    </div>

    <div class="generic-models-manager__separator"></div>

    <transition name="fade">
      <ModelsActionBar
        class="generic-models-manager__action-bar"
        v-show="selection.length > 0"
        :project="project"
        :models="selection"
        @archive="archiveModels"
        @delete="openDeleteModalOrWarningModal"
        @download="downloadModels"
        @open="openModels"
        @unarchive="unarchiveModels"
      />
    </transition>

    <ModelsTable
      class="generic-models-manager__table"
      :project="project"
      :models="displayedModelsFiltered"
      :fileUploads="fileUploads"
      @file-uploaded="onFileUploaded"
      @upload-canceled="onUploadCanceled"
      @upload-failed="onUploadCanceled"
      @go-folders-view="$emit('go-folders-view', $event)"
      @selection-changed="selection = $event"
      @archive="archiveModels([$event])"
      @unarchive="unarchiveModels([$event])"
      @delete="openDeleteModal([$event])"
      @download="downloadModels([$event])"
      @view-metaBuilding="$emit('view-metaBuilding', $event)"
      @edit-metaBuilding="$emit('edit-metaBuilding', $event)"
      @view-photosphereBuilding="$emit('view-photosphereBuilding', $event)"
      @edit-photosphereBuilding="$emit('edit-photosphereBuilding', $event)"
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
import { computed, ref, watch, watchEffect } from "vue";
import { useListFilter } from "../../../../../composables/list-filter.js";
import { useRouter } from "vue-router";
import { MODEL_CONFIG } from "../../../../../config/models.js";
import { IS_DELETION_TEMP_WORKAROUND_ENABLED } from "../../../../../config/projects.js";
import { WINDOWS } from "../../../../../config/viewer.js";
import { useFiles } from "../../../../../state/files.js";
import { useModels } from "../../../../../state/models.js";
import { useUser } from "../../../../../state/user.js";
import { wait } from "../../../../../utils/async.js";
import { isModel, openInViewer } from "../../../../../utils/models.js";
import { fileUploadInput } from "../../../../../utils/upload.js";

// Components
import ModelsActionBar from "../models-action-bar/ModelsActionBar.vue";
import ModelsDeleteModal from "../models-delete-modal/ModelsDeleteModal.vue";
import ModelsTable from "../../models-table/ModelsTable.vue";

export default {
  components: {
    ModelsActionBar,
    ModelsDeleteModal,
    ModelsTable,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0,
    },
    types: {
      type: Array,
      required: true,
    },
    fileUploadParams: {
      type: Object,
    },
  },
  emits: [
    "edit-metaBuilding",
    "edit-photosphereBuilding",
    "file-uploaded",
    "go-folders-view",
    "tab-changed",
    "view-metaBuilding",
    "view-photosphereBuilding",
  ],
  setup(props, { emit }) {
    const router = useRouter();
    const { isProjectGuest } = useUser();
    const { createModel, updateModels } = useModels();
    const { downloadFiles: download } = useFiles();

    const fileUploads = ref([]);
    const fileExtensions = computed(() =>
      props.types.reduce((ext, t) => ext.concat(MODEL_CONFIG[t].ext), []),
    );

    const currentTab = ref({});
    const selectTab = (tab) => {
      currentTab.value = tab;
      emit("tab-changed", tab);
    };

    watch(
      () => props.tabs,
      () => {
        currentTab.value =
          props.tabs.find((tab) => tab.id === currentTab.value?.id) || props.tabs[0];
      },
      { immediate: true },
    );

    const displayedModels = ref([]);
    watchEffect(() => {
      displayedModels.value = currentTab.value.models;
    });
    const { filteredList: displayedModelsFiltered, searchText } = useListFilter(
      displayedModels,
      ({ name }) => [name].join(" "),
    );

    const selection = ref([]);

    const archiveModels = async (models) => {
      await updateModels(
        props.project,
        models.map((model) => ({ ...model, archived: true })),
      );
    };

    const unarchiveModels = async (models) => {
      await updateModels(
        props.project,
        models.map((model) => ({ ...model, archived: false })),
      );
    };

    const modelsToDelete = ref([]);
    const showDeleteModal = ref(false);
    const openDeleteModal = (models) => {
      modelsToDelete.value = models;
      showDeleteModal.value = true;
    };
    const closeDeleteModal = () => {
      modelsToDelete.value = [];
      showDeleteModal.value = false;
    };

    const openDeleteModalOrWarningModal = (models) => {
      if (IS_DELETION_TEMP_WORKAROUND_ENABLED) {
        const { openModal } = useAppModal();
        openModal({ component: WarningModal });
      } else {
        openDeleteModal(models);
      }
    };

    const downloadModels = async (models) => {
      await download(
        props.project,
        models.map(({ document }) => document),
      );
    };

    const openModels = (models) => {
      openInViewer(router, props.project, models, WINDOWS.IFC3D);
    };

    const uploadModels = () => {
      fileUploadInput(
        "file",
        (event) => {
          fileUploads.value = fileUploads.value.concat(
            Array.from(event.target.files).map((file, i) => {
              ((file.key = Math.random() * i), file);
              file.params = props.fileUploadParams;
              return file;
            }),
          );
        },
        {
          accept: fileExtensions.value,
          multiple: true,
        },
      );
    };

    const onFileUploaded = async ({ key, file }) => {
      if (!isModel(file)) {
        await createModel(props.project, file);
      }
      const index = fileUploads.value.findIndex((f) => f.key === key);
      fileUploads.value.splice(index, 1);
      emit("file-uploaded");
    };
    const onUploadCanceled = async ({ key }) => {
      await wait(3000);
      const index = fileUploads.value.findIndex((f) => f.key === key);
      fileUploads.value.splice(index, 1);
    };

    return {
      // References
      currentTab,
      displayedModels,
      displayedModelsFiltered,
      searchText,
      fileUploads,
      modelsToDelete,
      selection,
      showDeleteModal,
      // Methods
      archiveModels,
      closeDeleteModal,
      downloadModels,
      isProjectGuest,
      onFileUploaded,
      onUploadCanceled,
      openDeleteModal,
      openDeleteModalOrWarningModal,
      openModels,
      selectTab,
      unarchiveModels,
      uploadModels,
    };
  },
};
</script>

<style scoped lang="scss" src="./GenericModelsManager.scss"></style>
