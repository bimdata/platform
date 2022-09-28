<template>
  <div class="files-manager-breadcrumb">
    <span class="files-manager-breadcrumb__path">
      <template v-for="(folder, index) of path" :key="folder.id">
        <BIMDataTextbox
          maxWidth="100px"
          :text="folder.name"
          @click="selectFile(folder)"
          tooltipColor="silver-light"
          :style="{
            cursor: 'pointer',
            margin: index === 0 ? 'auto 15px auto 5px' : 'auto 15px'
          }"
        />
        <span>></span>
      </template>
    </span>
    <BIMDataTextbox
      class="files-manager-breadcrumb__file"
      width="100px"
      :text="file.name"
      tooltipColor="silver-light"
      :style="{ marginLeft: path.length ? '15px' : '5px' }"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useFiles } from "../../../../../state/files.js";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  emits: ["file-clicked"],
  setup(props, { emit }) {
    const { fileStructureHandler: handler } = useFiles();

    const path = ref([]);

    watch(
      () => props.file,
      () => (path.value = handler.ancestors(props.file)),
      { immediate: true }
    );

    const selectFile = folder => emit("file-clicked", folder);

    return {
      path,
      selectFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerBreadcrumb.scss"></style>
