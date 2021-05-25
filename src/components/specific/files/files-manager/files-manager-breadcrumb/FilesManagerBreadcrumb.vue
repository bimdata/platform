<template>
  <div class="files-manager-breadcrumb">
    <span v-if="path.length > 0">{{ path.join(" > ") + " > " }}</span>
    <span style="font-weight: bold">{{ file.name }}</span>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { FileStructureHandler } from "@/utils/file-structure";

export default {
  props: {
    fileStructure: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const path = ref([]);

    let structure = {};

    watch(
      () => props.fileStructure,
      () => (structure = new FileStructureHandler(props.fileStructure)),
      { immediate: true }
    );
    watch(
      () => props.file,
      () => {
        let file = structure.file(props.file.id);
        const filePath = [];
        while (file.parent) {
          file = file.parent;
          filePath.unshift(file.name);
        }
        path.value = filePath;
      },
      { immediate: true }
    );

    return {
      path
    };
  }
};
</script>
