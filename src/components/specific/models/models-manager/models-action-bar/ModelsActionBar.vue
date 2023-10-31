<template>
  <div class="models-action-bar">
    <BIMDataButton
      :disabled="
        project.isGuest || !project.isAdmin && models.some(m => m.document?.user_permission < 100)
      "
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete', models)"
    >
      <BIMDataIconDelete size="xs" margin="0 6px 0 0" />
      <span>{{ $t("t.delete") }}</span>
    </BIMDataButton>

    <BIMDataButton
      :disabled="
        project.isGuest || !project.isAdmin && models.some(m => m.document?.user_permission < 100)
      "
      width="120px"
      ghost
      squared
      @click="
        $emit(models.every(m => m.archived) ? 'unarchive' : 'archive', models)
      "
    >
      <BIMDataIcon
        :name="models.every(m => m.archived) ? 'unarchive' : 'archive'"
        size="xs"
        margin="0 6px 0 0"
      />
      <span>
        {{ $t(`t.${models.every(m => m.archived) ? "unarchive" : "archive"}`) }}
      </span>
    </BIMDataButton>

    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('download', models)"
    >
      <BIMDataIconDownload size="s" margin="0 6px 0 0" />
      <span>{{ $t("t.download") }}</span>
    </BIMDataButton>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
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
