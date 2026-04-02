<template>
  <div class="model-path-cell" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <template v-if="hasLocation">
      <div class="model-path-cell__last-folder" v-click-away="() => (showFullPath = false)">
        <BIMDataIconFolderLocation fill color="primary" margin="0 12px 0 0" />
        <BIMDataTextbox
          :text="lastFolderLocation(model.document_id)"
          cutPosition="middle"
          :tooltip="false"
          width="auto"
          maxWidth="200px"
        />
      </div>
  
      <transition name="fade">
        <div v-if="hovering || showFullPath" class="model-path-cell__location">
          <div
            v-if="truncatedFolderLocation(model.document_id).length > 0"
            class="flex items-center"
            v-for="(folder, index) in truncatedFolderLocation(model.document_id)"
            :key="folder.id"
          >
            <div
              class="folder-name flex items-center"
              @click.stop="selectFile(folder)"
              v-if="folder.id !== 'ellipsis'"
            >
              <BIMDataIconFolderLocation
                v-if="index === truncatedFolderLocation(model.document_id).length - 1"
                fill
                color="primary"
                margin="0 6px 0 0"
              />
              <BIMDataIconFolder v-else fill color="primary" margin="0 6px 0 0" />
              <BIMDataTextbox
                :text="folder.name"
                cutPosition="middle"
                tooltipPosition="bottom"
                tooltipColor="primary"
                width="auto"
                maxWidth="200px"
              >
              </BIMDataTextbox>
            </div>
            <div v-if="folder.id === 'ellipsis'" class="folder-ellipsis flex items-center m-x-12">
              <BIMDataTextbox
                :text="folder.name"
                cutPosition="middle"
                tooltipPosition="bottom"
                tooltipColor="primary"
                width="auto"
                maxWidth="200px"
              >
              </BIMDataTextbox>
            </div>
            <div v-if="showChevron(folder, index, model.document_id)" class="m-x-6">
              <BIMDataIconChevron size="xxxs" fill color="default" />
            </div>
          </div>
  
          <span
            v-else
            class="folder-name flex items-center"
            @click.stop="goToGedRoot"
          >
            <BIMDataIconFolderLocation fill color="primary" margin="0 6px 0 0" />
            {{ $t("t.rootFolder") }}
          </span>
        </div>
      </transition>
    </template>
    <template v-else>
      -
    </template>
  </div>
</template>

<script>
import { computed, onActivated, onDeactivated, ref } from "vue";
import { useI18n } from "vue-i18n";
import { FILE_TYPE } from "../../../../../config/files.js";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useFiles } from "../../../../../state/files.js";
import { getAscendants } from "../../../../../utils/file-structure.js";

export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
    allFolders: {
      type: Array,
      required: true,
    },
  },
  emits: ["go-folders-view"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { fileStructureHandler: handler } = useFiles();

    const hovering = ref(false);
    const showFullPath = ref(false);
    const hasLocation = computed(
      () => ![MODEL_TYPE.META_BUILDING, MODEL_TYPE.PHOTOSPHERE_BUILDING].includes(props.model.type)
    );

    const folderLocation = (model) => {
      const parentFolders = getAscendants(model, props.allFolders)
        .map((f) => ({ id: f.id, name: f.name }))
        .reverse();
      return parentFolders;
    };

    const truncatedFolderLocation = (docId) => {
      const doc = handler.get({ nature: FILE_TYPE.DOCUMENT, id: docId });

      const parentFolders = folderLocation(doc);
      const maxFoldersToShow = 4;

      if (parentFolders.length > maxFoldersToShow) {
        return [
          ...parentFolders.slice(0, 2), // Les 2 premiers dossiers
          { id: "ellipsis", name: "..." }, // L'élément '...'
          ...parentFolders.slice(-2), // Les 2 derniers dossiers
        ];
      }
      return parentFolders;
    };

    const lastFolderLocation = (docId) => {
      const doc = handler.get({ nature: FILE_TYPE.DOCUMENT, id: docId });

      const parentFolders = getAscendants(doc, props.allFolders);
      return parentFolders[0]?.name ?? t("t.rootFolder");
    };

    const selectFile = (folder) => {
      const selectedFolder = props.allFolders.find((f) => f.id === folder.id);
      emit("go-folders-view", selectedFolder);
    };

    const showChevron = (folder, index, docId) => {
      const folderLocation = truncatedFolderLocation(docId);
      return (
        index < folderLocation.length - 1 &&
        folder.id !== "ellipsis" &&
        folderLocation[index + 1].id !== "ellipsis"
      );
    };

    const resetHover = () => {
      hovering.value = false;
      showFullPath.value = false;
    };

    onActivated(resetHover);
    onDeactivated(resetHover);

    const goToGedRoot = () => {
      emit("go-folders-view", null);
    };

    return {
      hasLocation,
      hovering,
      showFullPath,
      goToGedRoot,
      lastFolderLocation,
      selectFile,
      showChevron,
      truncatedFolderLocation,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelPathCell.scss"></style>
