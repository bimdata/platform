<template>
  <div class="file-path-cell" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div
      class="file-path-cell__last-folder"
      v-click-away="() => (showFullPath = false)"
    >
      <BIMDataIconFolderLocation fill color="primary" margin="0 12px 0 0" />
      <BIMDataTextbox
        :text="lastFolderLocation(file)"
        cutPosition="middle"
        :tooltip="false"
        width="auto"
        maxWidth="200px"
      />
    </div>
    <div v-show="hovering || showFullPath" class="file-path-cell__location">
      <div v-if="folderLocation(file).length > 0" v-for="(folder, index) in folderLocation(file)" :key="index" class="flex items-center">
        <div class="folder-name flex items-center">
          <BIMDataIconFolderLocation v-if="index === folderLocation(file).length - 1" fill color="primary" margin="0 6px 0 0" />
          <BIMDataIconFolder v-else fill color="primary" margin="0 6px 0 0" />
        <span> {{ folder }}</span>
        </div>
        <div v-if="index < folderLocation(file).length - 1" class="m-x-6">
          <BIMDataIconChevron size="xxxs" fill color="default" />
        </div>
      </div>
      <span v-else class="folder-name flex items-center" @click.stop="$emit('go-folders-view')">
        <BIMDataIconFolderLocation fill color="primary" margin="0 6px 0 0" />
        {{ $t('t.rootFolder') }}
      </span>
    </div>
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
  emits: ["go-folders-view"],
  setup(props) {
    const { t } = useI18n();
    const folderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders)
        .map((f) => f.name)
        .reverse()
      return parentFolders;
    };
    const lastFolderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders);
      return parentFolders[0]?.name ?? t('t.rootFolder');
    };

    const hovering = ref(false);
    const showFullPath = ref(false);
    return {
      hovering,
      showFullPath,
      folderLocation,
      lastFolderLocation,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilePathCell.scss"></style>
