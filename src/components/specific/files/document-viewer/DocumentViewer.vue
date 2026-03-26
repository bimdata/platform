<template>
  <div class="document-viewer">
    <div class="document-viewer__head">
      <BIMDataButton v-if="currentDocument?.model_id" fill radius @click="openViewer">
        <BIMDataIcon
          :name="MODEL_CONFIG[currentDocument.model_type].icon"
          size="s"
          margin="0 6px 0 0"
        />
        {{ $t("DocumentViewer.viewerButton") }}
      </BIMDataButton>

      <div class="document-viewer__head__actions">
        <BIMDataButton ghost rounded icon @click="download">
          <BIMDataIconDownload size="m" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="closeModal">
          <BIMDataIconClose size="xxs" />
        </BIMDataButton>
      </div>
    </div>

    <div class="document-viewer__body" @click.self="closeModal">
      <div class="document-viewer__body__title">
        <BIMDataTextbox :text="currentDocument?.name" />
      </div>

      <div class="btn-box" v-if="documentList.length > 1">
        <BIMDataButton
          width="40px"
          height="40px"
          fill
          rounded
          icon
          :disabled="index === 0"
          @click="index--"
        >
          <BIMDataIconChevron size="xs" :rotate="180" />
        </BIMDataButton>
      </div>

      <template v-if="file">
        <template v-if="[DWG, DXF, IFC].includes(fileType)">
          <div class="preview-container" @click.self="closeModal">
            <BIMDataModelPreview
              :type="[DWG, DXF].includes(fileType) ? '2d' : '3d'"
              :previewUrl="file"
              :width="600"
              :height="600"
            />
          </div>
        </template>

        <template v-else-if="[...OFFICE_FILES, PDF, '.pdf'].includes(fileType)">
          <div class="pdf-container">
            <BIMDataPDFViewer :pdf="{ file }" />
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

      <div class="btn-box" v-if="documentList.length > 1">
        <BIMDataButton
          width="40px"
          height="40px"
          fill
          rounded
          icon
          :disabled="index === documentList.length - 1"
          @click="index++"
        >
          <BIMDataIconChevron size="xs" />
        </BIMDataButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { MODEL_CONFIG, MODEL_TYPE } from "../../../../config/models.js";
import { OFFICE_FILES, IMAGE_FILES } from "../../../../config/files.js";
import FileService from "../../../../services/FileService.js";
import ModelService from "../../../../services/ModelService.js";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { fileExtension } from "../../../../utils/files.js";
import { openInViewer } from "../../../../utils/models.js";

// Components
import NoDocPreviewImage from "../../../images/NoDocPreviewImage.vue";

const { DWG, DXF, IFC, JPEG, PDF, PNG } = MODEL_TYPE;

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  documentList: {
    type: Array,
    required: true,
  },
  document: {
    type: Object,
    default: null,
  },
});

const router = useRouter();
const { closeModal } = useAppModal();
const { projectModels } = useModels();

const index = ref(0);

watch(
  () => props.document,
  (newDocument) => {
    const docIndex = props.documentList.findIndex((d) => d.id === newDocument.id);
    index.value = docIndex !== -1 ? docIndex : 0;
  },
  {
    immediate: true,
  }
);

const currentDocument = computed(() => {
  if (!props.documentList || props.documentList.length === 0) return null;
  return props.documentList[index.value];
});

const fileType = computed(() => {
  const doc = currentDocument.value;
  return doc ? doc.model_type ?? fileExtension(doc.file_name) : null;
});

const file = ref(null);

watchEffect(async () => {
  const doc = currentDocument.value;
  if (!doc) return;

  if ([DWG, DXF, IFC].includes(fileType.value)) {
    const model = projectModels.value.find(m => m.id === doc.model_id);
    if (!model.preview_file) {
      model.preview_file = (await ModelService.fetchModelByID(props.project, model.id)).preview_file;
    }
    file.value = model.preview_file;
  }

  if ([PDF, ".pdf", JPEG, PNG, ...IMAGE_FILES].includes(fileType.value)) {
    if (!doc.file) {
      doc.file = (await FileService.getDocument(props.project, { id: doc.id })).file;
    }
    file.value = doc.file;
  }

  if (OFFICE_FILES.includes(fileType.value)) {
    if (!doc.office_preview) {
      doc.office_preview = (await FileService.getDocument(props.project, { id: doc.id })).office_preview;
    }
    file.value = doc.office_preview;
  }
});

const onKeyUp = ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      if (index.value > 0) index.value--;
      break;
    case "ArrowRight":
      if (index.value < props.documentList.length - 1) index.value++;
      break;
    case "Escape":
      closeModal();
      break;
  }
};

onMounted(() => document.addEventListener("keyup", onKeyUp));
onBeforeUnmount(() => document.removeEventListener("keyup", onKeyUp));

const openViewer = () => {
  closeModal();
  const doc = currentDocument.value;
  openInViewer(router, props.project, {
    id: doc.model_id,
    type: doc.model_type,
  });
};

const { downloadFiles } = useFiles();
const download = () => {
  downloadFiles(props.project, [currentDocument.value]);
};
</script>

<style scoped lang="scss" src="./DocumentViewer.scss"></style>
