<template>
  <div class="files-manager-breadcrumb">
    <span v-if="path.length > 0">{{ path.join(" > ") + " > " }}</span>
    <span style="font-weight: bold">{{ file.name }}</span>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const handler = inject("fileStructureHandler");

    const path = ref([]);

    watch(
      () => props.file,
      () => {
        path.value = handler()
          .ancestors(props.file)
          .map(f => f.name);
      },
      { immediate: true }
    );

    return {
      path
    };
  }
};
</script>
