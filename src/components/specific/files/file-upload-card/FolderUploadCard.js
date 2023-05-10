import { h, reactive, ref } from "vue";
import UploadService from "../../../../services/UploadService.js";

import UploadCard from "./UploadCard.vue";

const SIMULTANEOUS_UPLOAD_LIMIT = 3;

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
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

    /** @type {Array<{ file: File, parentId: number }>} */
    let files = props.folder.files;
    const onGoingUploads = new Map();
    let lastProgressTime = null;

    const uploader = UploadService.createProjectFileUploader(props.project, {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: ({ id, bytesUploaded }) => {
        const currentlyUploaded =
          bytesUploaded - onGoingUploads.get(id).uploaded;
        progress.uploaded += currentlyUploaded;

        if (lastProgressTime) {
          const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
          const dx = currentlyUploaded; // in bytes
          progress.rate = Math.round(dx / dt);
        }
        progress.percentage = Math.min(
          Math.round((100 * progress.uploaded) / props.folder.size),
          100
        );

        onGoingUploads.get(id).uploaded = bytesUploaded;
        lastProgressTime = Date.now();
      },
      onUploadComplete: ({ id, response: document }) => {
        onGoingUploads.delete(id);

        if (files.length > 0) startNextUpload();

        if (onGoingUploads.size === 0) {
          uploading.value = false;
          emit("upload-completed", document);
        }
      },
      onUploadError: () => {
        onGoingUploads.forEach(upload => upload.cancel());
        uploading.value = false;
        failed.value = true;
        files = [];
        emit("upload-failed");
      }
    });

    const startNextUpload = () => {
      const { file, parentId } = files.shift();
      const { id, cancel } = uploader.upload(file, { parentId });
      onGoingUploads.set(id, { uploaded: 0, cancel });
    };

    const cancelUpload = () => {
      onGoingUploads.forEach(upload => upload.cancel());
      uploading.value = false;
      canceled.value = true;
      files = [];
      emit("upload-canceled");
    };

    if (files.length === 0) {
      emit("upload-completed");
    } else {
      while (
        files.length > 0 &&
        onGoingUploads.size < SIMULTANEOUS_UPLOAD_LIMIT
      ) {
        startNextUpload();
      }
    }

    return () =>
      h(UploadCard, {
        type: "folder",
        name: props.folder.name,
        total: props.folder.size,
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
