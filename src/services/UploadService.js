import { isConvertibleToModel } from "@/utils/models.js";
import { createFileUploader } from "@/utils/upload.js";
import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";
import ModelService from "./ModelService.js";

class UploadService {
  createSpaceImageUploader(
    space,
    { onUploadStart, onUploadComplete, onUploadError }
  ) {
    const uploader = createFileUploader(
      {
        method: "PATCH",
        url: `${process.env.VUE_APP_API_BASE_URL}/cloud/${space.id}`,
        accessToken: apiClient.config.accessToken().split(" ")[1]
      },
      {
        onUploadStart,
        onUploadComplete,
        onUploadError: event => {
          ErrorService.handleError(
            new RuntimeError(ERRORS.SPACE_IMAGE_UPDATE_ERROR, event)
          );
          onUploadError(event);
        }
      }
    );

    const upload = file => {
      const data = new FormData();
      data.append("image", file);

      uploader.upload(data);
    };

    const cancel = () => {
      uploader.cancel();
    };

    return { upload, cancel };
  }

  createProjectFileUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {
    const uploader = createFileUploader(
      {
        method: "POST",
        url: `${process.env.VUE_APP_API_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}/document`,
        accessToken: apiClient.config.accessToken().split(" ")[1]
      },
      {
        onUploadStart,
        onUploadProgress,
        onUploadComplete,
        onUploadError: event => {
          ErrorService.handleError(
            new RuntimeError(ERRORS.DOCUMENT_UPLOAD_ERROR, event)
          );
          onUploadError(event);
        }
      }
    );

    const upload = (file, parentId) => {
      const data = new FormData();
      data.append("file", file);
      data.append("name", file.name);
      if (parentId) data.append("parent_id", parentId);

      uploader.upload(data);
    };

    const cancel = () => {
      uploader.cancel();
    };

    return { upload, cancel };
  }

  createProjectModelUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {
    return this.createProjectFileUploader(project, {
      onUploadStart,
      onUploadProgress,
      onUploadError,
      onUploadComplete: async e => {
        const document = e.response;
        if (isConvertibleToModel(document)) {
          await ModelService.createModel(project, document);
        }
        onUploadComplete(e);
      }
    });
  }
}

const service = new UploadService();

export default service;
