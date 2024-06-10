<template>
  <div class="file-path-cell">
    <div
      class="file-path-cell__last-folder"
      @click.stop="onLastFolderClick(file)"
      v-click-away="() => (showFullPath = false)"
    >
      <BIMDataIconFolderLocation fill color="primary" margin="0 12px 0 0" />
      <BIMDataTextbox
        :text="lastFolderLocation(file)"
        cutPosition="middle"
        tooltipPosition="bottom"
        tooltipColor="primary"
        width="auto"
      />
    </div>
    <div v-show="showFullPath" class="file-path-cell__location">
      <BIMDataIconFolderLocation fill color="primary" margin="0 6px 0 0" />
      <div v-if="folderLocation(file).length > 0" class="flex items-center">
        <div v-for="(folder, index) in folderLocation(file)" :key="index" class="flex items-center">
          <span class="folder-name flex items-center">
            {{ folder }}
          </span>
          <span v-if="index < folderLocation(file).length - 1" class="m-x-6">
            >
          </span>
        </div>
      </div>
      <span v-else class="folder-name flex items-center">
        Dossier racine
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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
  setup(props) {
    const showFullPath = ref(false);
    const folderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders)
        .map((f) => f.name)
        .reverse()
      return parentFolders;
    };
    const lastFolderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders);
      return parentFolders[0]?.name ?? "Dossier racine";
    };

    const clickedFileKey = ref(null);
    const onLastFolderClick = (file) => {
      if(clickedFileKey.value === file.id) {
        showFullPath.value = !showFullPath.value;
      } else {
        clickedFileKey.value = file.id;
        showFullPath.value = true;
      }
    };
    return {
      showFullPath,
      folderLocation,
      lastFolderLocation,
      onLastFolderClick,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilePathCell.scss"></style>
