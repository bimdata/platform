<template>
  <div class="models-action-bar">
    <BIMDataButton
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete', models)"
    >
      <BIMDataIcon name="delete" size="xs" margin="0 6px 0 0" />
      <span>{{ $t("ModelsActionBar.deleteButtonText") }}</span>
    </BIMDataButton>

    <template v-if="currentTab === 'archive'">
      <BIMDataButton
        width="120px"
        ghost
        squared
        @click="$emit('unarchive', models)"
      >
        <BIMDataIcon name="unarchive" size="xs" margin="0 6px 0 0" />
        <span>{{ $t("ModelsActionBar.unarchiveButtonText") }}</span>
      </BIMDataButton>
    </template>
    <template v-else>
      <BIMDataButton
        width="120px"
        ghost
        squared
        @click="$emit('archive', models)"
      >
        <BIMDataIcon name="archive" size="xs" margin="0 6px 0 0" />
        <span>{{ $t("ModelsActionBar.archiveButtonText") }}</span>
      </BIMDataButton>
    </template>

    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('download', models)"
    >
      <BIMDataIcon name="download" size="s" margin="0 6px 0 0" />
      <span>{{ $t("ModelsActionBar.downloadButtonText") }}</span>
    </BIMDataButton>
    <!-- <BIMDataButton
      width="120px"
      ghost
      squared
      :disabled="models.length < 2"
      @click="$emit('merge', models)"
    >
      <BIMDataIcon name="union" size="xs" margin="0 6px 0 0" />
      <span>{{ $t("ModelsActionBar.mergeButtonText") }}</span>
    </BIMDataButton> -->
  </div>
</template>

<script>
export default {
  props: {
    currentTab: {
      type: String,
      default: ""
    },
    models: {
      type: Array,
      default: () => []
    }
  },
  emits: ["delete", "archive", "download", "unarchive"]
};
</script>

<style scoped lang="scss" src="./ModelsActionBar.scss"></style>
