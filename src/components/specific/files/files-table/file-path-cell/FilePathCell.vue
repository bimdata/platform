<template>
  <div @mouseover="showFullPath = true" @mouseleave="showFullPath = false" class="file-path-cell">
    {{ lastFolderLocation(file) }}
    <div v-show="showFullPath">
      {{ folderLocation(file) }}
    </div>
  </div>
</template>

<script>
import {  ref } from "vue";
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
        .join(" > ");
      return parentFolders;
    };
    const lastFolderLocation = (file) => {
      const parentFolders = getAscendants(file, props.allFolders);
      return parentFolders[0]?.name ?? "Dossier racine";
    };
    return {
      showFullPath,
      folderLocation,
      lastFolderLocation,
    };
  },
};
</script>
