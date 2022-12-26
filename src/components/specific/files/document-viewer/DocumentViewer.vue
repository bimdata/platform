<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { MODEL_CONFIG, MODEL_TYPE } from "../../../../config/models.js";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { fileExtension } from "../../../../utils/files.js";
import { openInViewer } from "../../../../utils/models.js";
// Components
import NoDocPreviewImage from "../../../images/NoDocPreviewImage.vue";

const { DWG, DXF, IFC, JPEG, PDF, PNG } = MODEL_TYPE;

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
  const models = projectModels.value;
  const doc = currentDocument.value;
  switch (fileType.value) {
    case IFC:
    case DWG:
    case DXF:
    case ".ifc":
    case ".dwg":
    case ".dxf":
      return models.find(m => m.id === doc.model_id)?.preview_file;
    case PDF:
    case ".pdf":
      return { file: doc.file };
    case JPEG:
    case PNG:
    case ".apng":
    case ".avif":
    case ".gif":
    case ".jpeg":
    case ".jpg":
    case ".png":
    case ".svg":
    case ".webp":
      return doc.file;
    default:
      return null;
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

onMounted(() => document.addEventListener("keyup", onKeyUp));
onUnmounted(() => document.removeEventListener("keyup", onKeyUp));

const openViewer = () => {
  closeModal();
  const doc = currentDocument.value;
  openInViewer(router, props.project, {
    id: doc.model_id,
    type: doc.model_type
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
        @click="openViewer"
      >
        <BIMDataIcon
          :name="MODEL_CONFIG[currentDocument.model_type].icon"
          size="s"
          margin="0 6px 0 0"
        />
        {{ $t("DocumentViewer.viewerButton") }}
      </BIMDataButton>

      <div class="document-viewer__head__actions">
        <BIMDataButton ghost rounded icon @click="download">
          <BIMDataIcon name="download" size="m" />
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

      <div class="btn-box">
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
      </div>

      <template v-if="file">
        <template v-if="[DWG, DXF, IFC].includes(fileType)">
          <div class="preview-container">
            <BIMDataModelPreview
              :type="[DWG, DXF].includes(fileType) ? '2d' : '3d'"
              :previewUrl="file"
              :width="600"
              :height="600"
            />
          </div>
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
          <NoDocPreviewImage style="width: 200px; height: 200px" />
          <div>{{ $t("DocumentViewer.docPlaceholder") }}</div>
        </div>
      </template>

      <div class="btn-box">
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
  </div>
</template>

<style scoped lang="scss" src="./DocumentViewer.scss"></style>
