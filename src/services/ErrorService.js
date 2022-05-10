import i18n from "@/i18n/index.js";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";

const ERRORS = Object.freeze({
  ORGANIZATIONS_FETCH_ERROR: "organizationsFetchError",
  ORGANIZATION_CREATE_ERROR: "organizationCreateError",
  ORGANIZATION_UPDATE_ERROR: "organizationUpdateError",
  ORGANIZATION_DELETE_ERROR: "organizationDeleteError",
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
  PROJECT_FETCH_FILE_ERROR: "projectFetchFileError",
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
  MODEL_CREATE_ERROR: "modelCreateError",
  MODEL_UPDATE_ERROR: "modelUpdateError",
  MODEL_DOWNLOAD_ERROR: "modelDownloadError",
  MODEL_MERGE_ERROR: "modelMergeError",
  MODEL_DELETE_ERROR: "modelDeleteError",
  FILE_STRUCTURE_FETCH_ERROR: "fileStructureFetchError",
  FILE_UPDATE_ERROR: "fileUpdateError",
  FILE_DOWNLOAD_ERROR: "fileDownloadError",
  FILE_DELETE_ERROR: "fileDeleteError",
  FOLDER_CREATE_ERROR: "folderCreateError",
  FILE_FETCH_ERROR: "fileFetchError",
  DOCUMENT_UPLOAD_ERROR: "documentUploadError",
  GROUPS_FETCH_ERROR: "groupsFetchError",
  GROUP_CREATE_ERROR: "groupCreateError",
  GROUP_UPDATE_ERROR: "groupUpdateError",
  GROUP_DELETE_ERROR: "groupDeleteError",
  TAGS_FETCH_ERROR: "tagsFetchError",
  TAGS_CREATE_ERROR: "tagsCreateError",
  TAGS_UPDATE_ERROR: "tagsUpdateError",
  TAGS_DELETE_ERROR: "tagsDeleteError",
  TAGS_ADD_DOCUMENT_ERROR: "tagsAddDocumentError",
  TAGS_DELETE_DOCUMENT_ERROR: "tagsDeleteDocumentError",
  VISA_CREATE_ERROR: "visaCreateError",
  VISA_CREATE_VALIDATION_ERROR: "visaCreateValidationError",
  VISA_FETCH_ERROR: "visaFetchError",
  VISA_ACCEPT_ERROR: "visaAcceptError",
  VISA_DENY_ERROR: "visaDenyError",
  VISA_CLOSE_ERROR: "visaCloseError",
  VISA_RESUME_ERROR: "visaResumeError",
  VISA_FECTH_CREATED_ERROR: "visaFetchCreatedError",
  VISA_FECTH_VALIDATOR_ERROR: "visaFetchValidatorError",
  VISA_DELETE_VALIDATION_ERROR: "visaDeleteValidationError",
  VISA_DELETE_ERROR: "visaDeleteError",
  VISA_UPDATE_ERROR: "visaUpdateError",
  VISA_REFRESH_ERROR: "visaRefreshError",
  VISA_FETCH_ALL_COMMENTS_ERROR: "visaFetchAllCommentsError",
  VISA_CREATE_COMMENTS_ERROR: "visaCreateCommentsError",
  VISA_UPDATE_COMMENT_ERROR: "visaUpdateCommentError",
  VISA_DELETE_COMMENT_ERROR: "visaDeleteCommentError",
  SUBSCRIPTIONS_FETCH_ERROR: "subscriptionsFetchError",
  PLATFORM_SUBSCRIBE_ERROR: "platformSubscribeError",
  DATAPACK_SUBSCRIBE_ERROR: "datapackSubscribeError",
  DATAPACK_UPDATE_ERROR: "datapackUpdateError"
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
    this.notify = useAppNotification().pushNotification;
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
