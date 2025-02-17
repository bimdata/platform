import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";
import ModelService from "./ModelService.js";
import { isConvertible, isModel } from "../utils/models.js";
import { createFileUploader } from "../utils/upload.js";

class UploadService {
  createSpaceImageUploader(
    space,
    { onUploadStart, onUploadComplete, onUploadError }
  ) {
    const uploader = createFileUploader(
      {
        method: "PATCH",
        url: `${ENV.VUE_APP_API_BASE_URL}/cloud/${space.id}`,
        accessToken: apiClient.accessToken
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
      return uploader.upload(data);
    };

    return { upload };
  }

  createProjectFileUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {
    const uploader = createFileUploader(
      {
        method: "POST",
        url: `${ENV.VUE_APP_API_BASE_URL}/cloud/${project.cloud.id}/project/${project.id}/document`,
        accessToken: apiClient.accessToken
      },
      {
        onUploadStart,
        onUploadProgress,
        onUploadComplete,
        onUploadError: event => {
          const errorId =
            event.srcElement?.status === 402
              ? "SPACE_SIZE_FULL_ERROR"
              : "DOCUMENT_UPLOAD_ERROR";
          ErrorService.handleError(new RuntimeError(ERRORS[errorId], event));
          onUploadError(event);
        }
      },
      {
        retryCount: 3,
        retryInterval: 500
      }
    );

    const upload = (file, { parentId, successorOf, processHint }) => {
      const data = new FormData();
      data.append("file", file);
      data.append("name", file.name);
      if (parentId) data.append("parent_id", parentId);
      if (successorOf) data.append("successor_of", successorOf);
      if (processHint) data.append("process_hint", processHint);
      return uploader.upload(data);
    };

    return { upload };
  }

  createProjectModelUploader(
    project,
    { onUploadStart, onUploadProgress, onUploadComplete, onUploadError }
  ) {
    return this.createProjectFileUploader(project, {
      onUploadStart,
      onUploadProgress,
      onUploadError,
      onUploadComplete: async event => {
        const document = event.response;
        if (isConvertible(document) && !isModel(document)) {
          await ModelService.createModel(project, document);
        }
        onUploadComplete(event);
      }
    });
  }
}

const service = new UploadService();

export default service;
