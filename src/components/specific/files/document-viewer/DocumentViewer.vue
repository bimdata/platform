<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import routeNames from "../../../../router/route-names.js";
import { useFiles } from "../../../../state/files.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { fileExtension } from "../../../../utils/files.js";
import { windowType } from "../../../../utils/models";

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  folder: {
    type: Object,
    required: true
  },
  document: {
    type: Object,
    default: null
  }
});

const router = useRouter();
const { closeModal } = useAppModal();

const documents = computed(() =>
  props.folder.children
    .filter(f => !isFolder(f))
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
);

const index = ref(0);
watch(
  () => props.document,
  doc => (index.value = documents.value.findIndex(d => d.id === doc.id) ?? 0),
  { immediate: true }
);

const currentDocument = computed(() => documents.value[index.value]);

const fileType = computed(() => {
  const doc = currentDocument.value;
  return doc.model_type ?? fileExtension(doc.file_name);
});
const fileUrl = computed(() => {
  // TODO: compute file url according to file type
  return currentDocument.value.file;
});

const openInViewer = () => {
  closeModal();
  const doc = currentDocument.value;
  router.push({
    name: routeNames.modelViewer,
    params: {
      spaceID: props.project.cloud.id,
      projectID: props.project.id,
      modelIDs: doc.model_id
    },
    query: {
      window: windowType(doc)
    }
  });
};

const { downloadFiles } = useFiles();
const download = () => {
  downloadFiles(props.project, [currentDocument.value]);
};
</script>

<template>
  <div class="document-viewer">
    <div class="document-viewer__head">
      <BIMDataButton
        v-show="currentDocument.model_id"
        fill
        radius
        @click="openInViewer"
      >
        <BIMDataIcon name="show" size="xs" margin="0 6px 0 0" />
        {{ $t("DocumentViewer.viewerButton") }}
      </BIMDataButton>

      <div class="document-viewer__head__actions">
        <BIMDataButton ghost rounded icon @click="download">
          <BIMDataIcon name="download" size="xs" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="closeModal">
          <BIMDataIcon name="close" size="xxs" />
        </BIMDataButton>
      </div>
    </div>

    <div class="document-viewer__body">
      <BIMDataButton
        width="40px"
        height="40px"
        fill
        rounded
        icon
        :disabled="index === 0"
        @click="index--"
      >
        <BIMDataIcon name="chevron" size="xs" :rotate="180" />
      </BIMDataButton>

      <div class="content">
        <img :src="fileUrl" :alt="currentDocument.name" />
      </div>

      <BIMDataButton
        width="40px"
        height="40px"
        fill
        rounded
        icon
        :disabled="index === documents.length - 1"
        @click="index++"
      >
        <BIMDataIcon name="chevron" size="xs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./DocumentViewer.scss"></style>
