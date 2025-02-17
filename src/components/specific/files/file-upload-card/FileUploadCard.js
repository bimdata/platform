import { h, onMounted, reactive, ref } from "vue";
import UploadService from "../../../../services/UploadService.js";

import UploadCard from "./UploadCard.vue";

export default {
  props: {
    isModelUpload: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object
    },
    file: {
      type: Object,
      required: true
    },
    condensed: {
      type: Boolean,
      default: false
    }
  },
  emits: ["upload-completed", "upload-canceled", "upload-failed"],
  setup(props, { emit }) {
    const uploading = ref(false);
    const failed = ref(false);
    const canceled = ref(false);

    const progress = reactive({
      uploaded: 0,
      percentage: 0,
      rate: 0
    });

    let uploader, upload;
    let lastProgressTime = null;

    const handlers = {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: ({ bytesUploaded, bytesTotal }) => {
        if (lastProgressTime) {
          const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
          const dx = bytesUploaded - progress.uploaded; // in bytes
          progress.rate = Math.round(dx / dt);
        }
        progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
        progress.uploaded = bytesUploaded;
        lastProgressTime = Date.now();
      },
      onUploadComplete: ({ response: document }) => {
        uploading.value = false;
        emit("upload-completed", document);
      },
      onUploadError: () => {
        uploading.value = false;
        failed.value = true;
        emit("upload-failed");
      }
    };

    const cancelUpload = () => {
      upload?.cancel();
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    if (props.isModelUpload) {
      uploader = UploadService.createProjectModelUploader(
        props.project,
        handlers
      );
    } else {
      uploader = UploadService.createProjectFileUploader(
        props.project,
        handlers
      );
    }

    onMounted(() => {
      upload = uploader.upload(props.file, {
        parentId: props.folder?.id ?? null,
        processHint: props.file.params?.processHint,
      });
    });

    return () =>
      h(UploadCard, {
        type: "file",
        name: props.file.name,
        total: props.file.size,
        uploaded: progress.uploaded,
        percentage: progress.percentage,
        rate: progress.rate,
        uploading: uploading.value,
        failed: failed.value,
        canceled: canceled.value,
        condensed: props.condensed,
        onCancel: cancelUpload
      });
  }
};
