<template>
  <div class="file-path-cell" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div class="file-path-cell__last-folder" v-click-away="() => (showFullPath = false)">
      <BIMDataIconFolderLocation fill color="primary" margin="0 12px 0 0" />
      <BIMDataTextbox
        :text="lastFolderLocation(file)"
        cutPosition="middle"
        :tooltip="false"
        width="auto"
        maxWidth="200px"
      />
    </div>
    <transition name="fade">
      <div v-show="hovering || showFullPath" class="file-path-cell__location">
        <div
          v-if="truncatedFolderLocation(file).length > 0"
          class="flex items-center"
          v-for="(folder, index) in truncatedFolderLocation(file)"
          :key="folder.id"
        >
          <div
            class="folder-name flex items-center"
            @click.stop="selectFile(folder)"
            v-if="folder.id !== 'ellipsis'"
          >
            <BIMDataIconFolderLocation
              v-if="index === truncatedFolderLocation(file).length - 1"
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
          <div v-if="showChevron(folder, index, file)" class="m-x-6">
            <BIMDataIconChevron size="xxxs" fill color="default" />
          </div>
        </div>

        <span v-else class="folder-name flex items-center" @click.stop="$emit('go-folders-view')">
          <BIMDataIconFolderLocation fill color="primary" margin="0 6px 0 0" />
          {{ $t("t.rootFolder") }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAscendants } from "../../../../../utils/file-structure.js";
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    allFolders: {
      type: Array,
      required: true,
    },
  },
  emits: ["go-folders-view", "file-clicked"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const folderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders)
        .map((f) => ({
          id: f.id,
          name: f.name,
        }))
        .reverse();
      return parentFolders;
    };

    const truncatedFolderLocation = (file) => {
      const parentFolders = folderLocation(file);
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

    const lastFolderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders);
      return parentFolders[0]?.name ?? t("t.rootFolder");
    };

    const hovering = ref(false);
    const showFullPath = ref(false);

    const selectFile = (folder) => {
      const selectedFolder = props.allFolders.find((f) => f.id === folder.id);
      emit("file-clicked", selectedFolder);
      emit("go-folders-view");
    };

    const showChevron = (folder, index, file) => {
      return (
        index < truncatedFolderLocation(file).length - 1 &&
        folder.id !== "ellipsis" &&
        truncatedFolderLocation(file)[index + 1].id !== "ellipsis"
      );
    };

    return {
      hovering,
      showFullPath,
      lastFolderLocation,
      selectFile,
      showChevron,
      truncatedFolderLocation,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilePathCell.scss"></style>