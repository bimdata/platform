<template>
  <div class="files-manager-breadcrumb">
    <span class="files-manager-breadcrumb__path">
      <template v-for="folder of path" :key="folder.id">
        <TextBox
          :text="folder.name"
          :maxLength="24"
          tooltipColor="tertiary-lightest"
        />
        <span>></span>
      </template>
    </span>
    <TextBox
      class="files-manager-breadcrumb__file"
      :text="file.name"
      :maxLength="24"
      tooltipColor="tertiary-lightest"
    />
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";
// Components
import TextBox from "@/components/generic/text-box/TextBox";

export default {
  components: {
    TextBox
  },
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
      () => (path.value = handler().ancestors(props.file)),
      { immediate: true }
    );

    return {
      path
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerBreadcrumb.scss"></style>
