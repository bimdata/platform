import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import apiClient from "./api-client";

let fileUploadInstanceID = 0;

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

    const reset = () => uppy.reset();

    return { upload, reset };
  }

  createProjectFileUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {
    const uppy = new Uppy({
      id: `project-file-${fileUploadInstanceID++}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: +process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1
      }
    });

    uppy.use(XHRUpload, {
      method: "POST",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}/document`,
      fieldName: "file",
      metaFields: ["name", "parent_id"],
      headers: {
        Authorization: apiClient.config.accessToken()
      }
    });

    uppy.on("file-added", onUploadStart);
    uppy.on("upload-progress", onUploadProgress);
    uppy.on("complete", onUploadComplete);
    uppy.on("upload-error", onUploadError);

    const upload = (file, parentId) =>
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          parent_id: parentId || project.rootFolderId
        }
      });

    const cancel = () => uppy.cancelAll();

    const reset = () => uppy.reset();

    return { upload, cancel, reset };
  }
}

const service = new UploadService();

export default service;
