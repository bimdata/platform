import i18n from "@/i18n";
import { useNotifications } from "@/composables/notifications";

const ERRORS = Object.freeze({
  SPACES_FETCH_ERROR: "spacesFetchError",
  SPACE_CREATE_ERROR: "spaceCreateError",
  SPACE_UPDATE_ERROR: "spaceUpdateError",
  SPACE_DELETE_ERROR: "spaceDeleteError",
  SPACE_IMAGE_UPDATE_ERROR: "spaceImageUpdateError",
  SPACE_IMAGE_DELETE_ERROR: "spaceImageDeleteError",
  PROJECTS_FETCH_ERROR: "projectsFetchError",
  PROJECT_CREATE_ERROR: "projectCreateError",
  PROJECT_UPDATE_ERROR: "projectUpdateError",
  PROJECT_DELETE_ERROR: "projectDeleteError",
  INVITATIONS_FETCH_ERROR: "invitationsFetchError",
  INVITATION_SEND_ERROR: "invitationSendError",
  INVITATION_RESEND_ERROR: "invitationResendError",
  INVITATION_CANCEL_ERROR: "invitationCancelError",
  USERS_FETCH_ERROR: "usersFetchError",
  USER_UPDATE_ERROR: "userUpdateError",
  USER_DELETE_ERROR: "userDeleteError",
  USER_LEAVE_ERROR: "userLeaveError",
  MODELS_FETCH_ERROR: "modelsFetchError",
  MODEL_UPLOAD_ERROR: "modelUploadError",
  MODEL_UPDATE_ERROR: "modelUpdateError",
  MODEL_DOWNLOAD_ERROR: "modelDownloadError",
  MODEL_MERGE_ERROR: "modelMergeError",
  MODEL_DELETE_ERROR: "modelDeleteError",
  FILE_STRUCTURE_FETCH_ERROR: "fileStructureFetchError",
  FILE_UPDATE_ERROR: "fileUpdateError",
  FILE_DOWNLOAD_ERROR: "fileDownloadError",
  FILE_DELETE_ERROR: "fileDeleteError",
  FOLDER_CREATE_ERROR: "folderCreateError",
  DOCUMENT_UPLOAD_ERROR: "documentUploadError",
  GROUPS_FETCH_ERROR: "groupsFetchError",
  GROUP_CREATE_ERROR: "groupCreateError",
  GROUP_UPDATE_ERROR: "groupUpdateError",
  GROUP_DELETE_ERROR: "groupDeleteError"
});

class RuntimeError {
  constructor(id, error) {
    this.id = id;
    this.error = error;
  }
}

class HttpClientError extends RuntimeError {
  constructor(id, error) {
    super(id, error);
  }
}

class HttpServerError extends RuntimeError {
  constructor(id, error) {
    super(id, error);
  }
}

class ErrorService {
  constructor() {
    this.t = i18n.global.t;
    this.notify = useNotifications().pushNotification;
  }

  handleError(error) {
    console.error(error);
    if (error instanceof RuntimeError) {
      this.notifyError(error.id);
    }
  }

  notifyError(errorId) {
    this.notify({
      type: "error",
      title: this.t("Error"),
      message: this.t(`Errors.${errorId}`)
    });
  }
}

const service = new ErrorService();

export {
  ERRORS,
  RuntimeError,
  HttpClientError,
  HttpServerError,
  service as ErrorService
};

export default service;
