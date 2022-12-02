<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { MODEL_TYPE } from "../../../../config/models.js";
import routeNames from "../../../../router/route-names.js";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { fileExtension } from "../../../../utils/files.js";
import { windowType } from "../../../../utils/models.js";

const { DWG, DXF, IFC, PDF } = MODEL_TYPE;

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
const { projectModels } = useModels();

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
const file = computed(() => {
  switch (fileType.value) {
    case IFC:
    case ".ifc":
    case DWG:
    case ".dwg":
    case DXF:
    case ".dxf":
      return projectModels.value.find(
        m => m.id === currentDocument.value.model_id
      )?.preview_file;
    case PDF:
    case ".pdf":
      return { file: currentDocument.value.file };
    default:
      return currentDocument.value.file;
  }
});

const onKeyUp = ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      if (index.value > 0) index.value--;
      break;
    case "ArrowRight":
      if (index.value < documents.value.length - 1) index.value++;
      break;
    case "Escape":
      closeModal();
      break;
  }
};

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
  <div class="document-viewer" @keyup.prevent="onKeyUp">
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

    <div class="document-viewer__body" @click.self="closeModal">
      <div class="document-viewer__body__title">
        <BIMDataTextbox :text="currentDocument?.name" />
      </div>

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

      <template v-if="file">
        <template v-if="[DWG, DXF, IFC].includes(fileType)">
          <BIMDataModelPreview
            :type="[DWG, DXF].includes(fileType) ? '2d' : '3d'"
            :previewUrl="file"
            :width="500"
            :height="500"
          />
        </template>

        <template v-else-if="[PDF, '.pdf'].includes(fileType)">
          <div class="pdf-container">
            <BIMDataPDFViewer :pdf="file" />
          </div>
        </template>

        <template v-else>
          <div class="img-container">
            <img :src="file" :alt="currentDocument.name" />
          </div>
        </template>
      </template>

      <template v-else>
        <div class="doc-placeholder">
          {{ $t("DocumentViewer.docPlaceholder") }}
        </div>
      </template>

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
