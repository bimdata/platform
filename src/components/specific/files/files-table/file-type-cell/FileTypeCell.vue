<template>
  <div class="file-type-cell">
    <template v-if="isFolder(file)">
      <BIMDataIcon
        :name="hasAdminPerm(project, file) ? 'folder' : 'readonlyFolder'"
        size="m"
        fill
        color="primary"
      />

      <span v-if="file.children.length === 0" class="file-type-cell__folder-icon empty"> 0 </span>

      <span v-else class="file-type-cell__folder-icon not-empty">
        {{ file.children.length }}
      </span>

      <div
        v-if="file.hasNamingConflict"
        class="info"
        role="button"
        tabindex="0"
        @click.stop="openNamingConflictModal"
        @keyup.enter.stop="openNamingConflictModal"
        @keyup.space.prevent.stop="openNamingConflictModal"
      >
        <div class="round"></div>
      </div>
    </template>

    <BIMDataFileIcon v-else :fileName="file.file_name" :size="20" />
  </div>
</template>

<script setup>
import { useUser } from "../../../../../state/user.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { matchName } from "../../../../../utils/naming-constraint.js";

import NamingConflictModal from "../../naming-constraint/NamingConflictModal.vue";

const { hasAdminPerm } = useUser();
const { getEffectiveFolderRule } = useNamingConstraints();
const { openModal, closeModal } = useAppModal();

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  project: {
    type: Object,
    required: true,
  },
});

const openNamingConflictModal = async () => {
  if (!props.file.hasNamingConflict) {
    return;
  }

  const rule = await getEffectiveFolderRule(props.project, {
    id: props.file.id,
  });

  const conflictingDocuments = (props.file.children ?? []).filter((document) => {
    if (isFolder(document) || !rule) {
      return false;
    }

    return !matchName(document.name, rule);
  });

  openModal({
    component: NamingConflictModal,
    props: {
      project: props.project,
      documents: conflictingDocuments,
      allFolders: [],
      rule,
      onClose: closeModal,
      onConfirm: closeModal,
    },
  });
};
</script>

<style lang="scss" src="./FileTypeCell.scss"></style>
