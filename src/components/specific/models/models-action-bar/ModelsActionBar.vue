<template>
  <div class="models-action-bar">
    <BIMDataButton
      color="high"
      ghost
      squared
      @click="$emit('delete-clicked', models)"
    >
      <BIMDataIcon name="delete" size="xs" />
      <span>{{ $t("ModelsActionBar.delete") }}</span>
    </BIMDataButton>
    <BIMDataButton ghost squared @click="$emit('archive-clicked', models)">
      <BIMDataIcon name="import" size="xs" />
      <span>{{ $t("ModelsActionBar.archive") }}</span>
    </BIMDataButton>
    <BIMDataButton ghost squared @click="$emit('download-clicked', models)">
      <BIMDataIcon name="cloud" size="xs" />
      <span>{{ $t("ModelsActionBar.download") }}</span>
    </BIMDataButton>
    <BIMDataButton
      ghost
      squared
      @click="$emit('merge-clicked', models)"
      :disabled="models.length < 2"
    >
      <BIMDataIcon name="union" size="xs" />
      <span>{{ $t("ModelsActionBar.merge") }}</span>
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
