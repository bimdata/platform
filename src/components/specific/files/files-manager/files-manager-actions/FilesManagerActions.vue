<template>
  <div class="files-manager__actions">
    <div class="start" v-if="selectedFileTab.id === 'folders'">
      <template v-if="menuItems.length > 0">
        <BIMDataDropdownMenu
          ref="dropdown"
          class="files-manager__actions__dropdown"
          width="20%"
          height="32px"
          :menuItems="menuItems"
          :subListMaxHeight="dropdownMaxHeight"
        >
          <template #header="{ isOpen }">
            <BIMDataIconBurgerMenu size="m" fill color="primary" />
            <BIMDataIcon name="chevron" size="xxs" fill color="primary" :rotate="isOpen ? 90 : 0" />
          </template>
        </BIMDataDropdownMenu>
      </template>
      <FolderCreationButton
        data-guide="btn-new-folder"
        class="files-manager__actions__btn-new-folder"
        width="100%"
        :project="project"
        :folder="currentFolder"
        :disabled="!hasAdminPerm(project, currentFolder)"
      >
        <BIMDataIconAddFolder size="xs" />
        <span v-if="isLargeLayout" style="margin-left: 6px">
          {{ $t("FolderCreationButton.text") }}
        </span>
        <span v-else-if="isMediumLayout" style="margin-left: 6px">
          {{ $t("t.folder") }}
        </span>
      </FolderCreationButton>
      <BIMDataTooltip
        data-guide="btn-upload-file"
        data-test-id="btn-upload-file"
        class="files-manager__actions__btn-new-file"
        color="high"
        :disabled="isUserOrga(currentSpace) || !isFullTotal(spaceSubInfo)"
        :text="
          $t(
            `ProjectOverview.uploadDisableMessage.${
              isFullTotal(spaceSubInfo) ? 'size' : 'permission'
            }`
          )
        "
      >
        <template v-if="shouldSubscribe">
          <BIMDataButton
            width="100%"
            height="32px"
            color="primary"
            fill
            radius
            :disabled="!hasAdminPerm(project, currentFolder)"
            @click="$emit('open-subscription-modal')"
          >
            <BIMDataIconAddFile size="xs" />
            <span v-if="isLargeLayout" style="margin-left: 6px">
              {{ $t("FileUploadButton.addFileButtonText") }}
            </span>
            <span v-else-if="isMediumLayout" style="margin-left: 6px">
              {{ $t("t.file") }}
            </span>
          </BIMDataButton>
        </template>
        <template v-else>
          <BIMDataButton
            width="100%"
            color="primary"
            fill
            radius
            icon
            :disabled="
              !hasAdminPerm(project, currentFolder) ||
              (!isUserOrga(currentSpace) && isFullTotal(spaceSubInfo))
            "
            @click="
              fileUploadInput('file', (event) => $emit('upload-files', event), {
                accept: allowedFileTypes,
                multiple: true,
              })
            "
          >
            <BIMDataIconAddFile size="xs" />
            <span v-if="isLargeLayout" style="margin-left: 6px">
              {{ $t("FileUploadButton.addFileButtonText") }}
            </span>
            <span v-else-if="isMediumLayout" style="margin-left: 6px">
              {{ $t("t.file") }}
            </span>
          </BIMDataButton>
        </template>
      </BIMDataTooltip>
    </div>

    <div class="middle">
      <BIMDataSearch
        class="files-manager__actions__input-search"
        :width="isMD ? '200px' : isLG ? '300px' : '400px'"
        :placeholder="$t('t.search')"
        v-model="searchText"
        clear
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, inject, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
import {
  useStandardBreakpoints,
  useCustomBreakpoints,
} from "../../../../../composables/responsive.js";
import { useFiles } from "../../../../../state/files.js";
import { useUser } from "../../../../../state/user.js";
import { isFullTotal } from "../../../../../utils/spaces.js";
import { fileUploadInput } from "../../../../../utils/upload.js";

// Components
import FileDragAndDropModal from "../file-drag-and-drop-modal/FileDragAndDropModal.vue";
import FolderCreationButton from "../../folder-creation-button/FolderCreationButton.vue";

export default {
  components: {
    FolderCreationButton,
  },
  props: {
    currentFolder: {
      type: Object,
      required: true,
    },
    currentSpace: {
      type: Object,
      required: true,
    },
    importFromOtherProjectsActions: {
      type: Array,
      required: true,
    },
    initialSearchText: {
      type: String,
    },
    project: {
      type: Object,
      required: true,
    },
    selectedFileTab: {
      type: Object,
      required: true,
    },
    spaceSubInfo: {
      type: Object,
      required: true,
    },
  },
  emits: ["open-subscription-modal", "update:searchText", "upload-files"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isUserOrga, isProjectAdmin, isProjectGuest, hasAdminPerm } = useUser();
    const { openModal } = useAppModal();

    const shouldSubscribe = inject("shouldSubscribe");


    const {
      downloadFiles: download,
      projectFileStructure,
    } = useFiles();

    const downloadFiles = async (files) => {
      await download(props.project, files);
    };

    const dropdown = ref(null);
    const menuItems = computed(() => {
      const items = [];

      if (isProjectAdmin(props.project)) {
        items.push(
          {
            name: t("FilesManager.structureImport"),
            children: { list: props.importFromOtherProjectsActions },
          },
          {
            name: t("FilesManager.gedDownload"),
            action: () => downloadFiles([projectFileStructure.value]),
          }
        );
      }

      if (hasAdminPerm(props.project, props.currentFolder)) {
        items.splice(1, 0, {
          name: t("FilesManager.folderImport"),
          action: () => {
            openModal({
              component: FileDragAndDropModal,
              props: {
                onDrop: (event) => {
                  emit("upload-files", event);
                },
              },
            });
            dropdown.value.displayed = false; // force close the drop down menu
          },
        });
      }

      return items;
    });

    const fileManager = ref(null);
    const dropdownMaxHeight = computed(() => {
      if (!fileManager.value || !dropdown.value) return;
      const { y, height: H } = dropdown.value.$el.getBoundingClientRect();
      return `${fileManager.value?.$el?.getBoundingClientRect().height - H - y}px`;
    });

    const { isMD, isLG, isXL } = useStandardBreakpoints();
    const { isMidXXL, isXXXL } = useCustomBreakpoints({
      isMidXXL: ({ width }) => width <= 1277 - 0.02,
      isXXXL: ({ width }) => width <= 1521 - 0.02,
    });

    const isLargeLayout = computed(
      () =>
        (isProjectAdmin(props.project) && !isXXXL.value) ||
        (!isProjectAdmin(props.project) && !isMidXXL.value)
    );
    const isMediumLayout = computed(
      () =>
        (isProjectAdmin(props.project) && !isXL.value && isXXXL.value) ||
        (!isProjectAdmin(props.project) && !isMD.value && isMidXXL.value)
    );

    const searchText = ref(props.initialSearchText || '');
    watch(searchText, (newValue) => {
      emit('update:searchText', newValue);
    });

    return {
      // References
      dropdown,
      dropdownMaxHeight,
      fileManager,
      isLargeLayout,
      isMediumLayout,
      menuItems,
      searchText,
      shouldSubscribe,
      // Methods
      downloadFiles,
      hasAdminPerm,
      isFullTotal,
      isUserOrga,
      fileUploadInput,
      // Responsive breakpoints
      isMD,
      isLG,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesManagerActions.scss"></style>
