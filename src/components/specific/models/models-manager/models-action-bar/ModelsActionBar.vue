<script setup>
import { computed } from "vue";
import { useUser } from "../../../../../state/user.js";

const { hasAdminPermModel } = useUser();

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  models: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  "archive",
  "delete",
  "download",
  "unarchive"
]);

const isArchived = computed(() => props.models.every(m => m.archived));
</script>

<template>
  <div class="models-action-bar">
    <BIMDataButton
      :disabled="!hasAdminPermModel(project, models)"
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
      :disabled="!hasAdminPermModel(project, models)"
      width="120px"
      ghost
      squared
      @click="
        $emit(isArchived ? 'unarchive' : 'archive', models)
      "
    >
      <BIMDataIcon
        :name="isArchived ? 'unarchive' : 'archive'"
        size="xs"
        margin="0 6px 0 0"
      />
      <span>
        {{ $t(`t.${isArchived ? "unarchive" : "archive"}`) }}
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

<style scoped lang="scss" src="./ModelsActionBar.scss"></style>
