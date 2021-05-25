<template>
  <div class="project-files">
    <app-slot-content name="view-header-right">
      <BIMDataButton
        data-test="btn-toggle-groups"
        width="120px"
        color="primary"
        fill
        radius
        @click="() => {}"
      >
        <BIMDataIcon name="user" size="xxxs" />
        <span>{{ $t("ProjectFiles.groupsButtonText") }}</span>
      </BIMDataButton>
    </app-slot-content>

    <FilesManager
      class="project-files__block--files"
      :project="project"
      :files="files"
      :fileStructure="fileStructure"
    />
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import AppSlotContent from "@/components/generic/app-slot-content/AppSlotContent.vue";
import FilesManager from "@/components/specific/files/files-manager/FilesManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    AppSlotContent,
    FilesManager
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    },
    fileStructure: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
