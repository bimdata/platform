import { h, onMounted, reactive, ref } from "vue";
import { useUpload } from "../../../../composables/upload.js";

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
    const { projectFileUploader, projectModelUploader } = useUpload();

    const uploading = ref(false);
    const failed = ref(false);
    const canceled = ref(false);

    const progress = reactive({
      uploaded: 0,
      percentage: 0,
      rate: 0
    });

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
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    let uploader;
    if (props.isModelUpload) {
      uploader = projectModelUploader(props.project, handlers);
    } else {
      uploader = projectFileUploader(props.project, handlers);
    }

    onMounted(() => {
      uploader.upload(props.file, props.folder?.id ?? null);
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
