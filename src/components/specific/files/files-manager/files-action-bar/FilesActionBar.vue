<template>
  <div class="files-action-bar">
    <BIMDataButton
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete', files)"
    >
      <BIMDataIcon name="delete" size="xs" />
      <span>{{ $t("FilesActionBar.deleteButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      color="secondary"
      ghost
      squared
      @click="$emit('move', files)"
    >
      <BIMDataIcon name="folderOpen" size="xs" />
      <span>{{ $t("FilesActionBar.moveButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('download', files)"
    >
      <BIMDataIcon name="download" size="s" />
      <span>{{ $t("FilesActionBar.downloadButtonText") }}</span>
    </BIMDataButton>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  emits: ["delete", "download", "move"]
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
