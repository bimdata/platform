<script setup>
import { useUser } from "../../../../../state/user.js";
import { isFolder } from "../../../../../utils/file-structure.js";

const { hasAdminPerm } = useUser();

defineProps({
  file: {
    type: Object,
    required: true,
  },
  project: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="file-type-cell">
    <template v-if="isFolder(file)">
      <BIMDataIcon
        v-if="isFolder(file)"
        :name="hasAdminPerm(project, file) ? 'folder' : 'readonlyFolder'"
        size="m"
        fill
        color="primary"
      />
      <span v-if="file.children.length === 0" class="file-type-cell__folder-icon empty">0</span>
      <span v-else class="file-type-cell__folder-icon not-empty">{{ file.children.length }}</span>
    </template>
    <BIMDataFileIcon v-else :fileName="file.file_name" :size="20" />
  </div>
</template>

<style lang="scss" src="./FileTypeCell.scss"></style>
