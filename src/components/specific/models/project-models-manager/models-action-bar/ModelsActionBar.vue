<template>
  <div class="models-action-bar">
    <BIMDataButton
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete-clicked', models)"
    >
      <BIMDataIcon name="delete" size="xs" />
      <span>{{ $t("ModelsActionBar.deleteButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('archive-clicked', models)"
    >
      <BIMDataIcon name="archive" size="xs" />
      <span>{{ $t("ModelsActionBar.archiveButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('download-clicked', models)"
    >
      <BIMDataIcon name="download" size="s" />
      <span>{{ $t("ModelsActionBar.downloadButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      ghost
      squared
      :disabled="models.length < 2"
      @click="$emit('merge-clicked', models)"
    >
      <BIMDataIcon name="union" size="xs" />
      <span>{{ $t("ModelsActionBar.mergeButtonText") }}</span>
    </BIMDataButton>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    models: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "delete-clicked",
    "archive-clicked",
    "download-clicked",
    "merge-clicked"
  ]
};
</script>

<style scoped lang="scss" src="./ModelsActionBar.scss"></style>
