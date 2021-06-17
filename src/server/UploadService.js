import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import apiClient from "./api-client";

class UploadService {
  createSpaceImageUploader(
    space,
    { onUploadStart, onUploadComplete, onUploadError }
  ) {
    const uppy = new Uppy({
      id: `space-image-${space.id}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: +process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1
      }
    });

    uppy.use(XHRUpload, {
      method: "PATCH",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${space.id}`,
      fieldName: "image",
      metaFields: [],
      headers: {
        Authorization: apiClient.config.accessToken()
      }
    });

    uppy.on("file-added", onUploadStart);
    uppy.on("complete", onUploadComplete);
    uppy.on("upload-error", onUploadError);

    const upload = file =>
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file
      });

    return { upload, instance: uppy };
  }

  createModelUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {}

  createFileUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {}
}

const service = new UploadService();

export default service;
