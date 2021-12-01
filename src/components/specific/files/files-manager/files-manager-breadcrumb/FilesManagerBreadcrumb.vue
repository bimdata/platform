<template>
  <div class="files-manager-breadcrumb">
    <span class="files-manager-breadcrumb__path">
      <template v-for="(folder, index) of path" :key="folder.id">
        <TextBox
          :text="folder.name"
          :maxLength="24"
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
    <TextBox
      class="files-manager-breadcrumb__file"
      :text="file.name"
      :maxLength="24"
      tooltipColor="silver-light"
      :style="{ marginLeft: path.length ? '15px' : '5px' }"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useFiles } from "@/state/files";

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
