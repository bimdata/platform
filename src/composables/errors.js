import i18n from "@/i18n";
import { useNotifications } from "./notifications";

const DEFAULT_OPTIONS = {
  log: true, // whether to log error
  notify: true // whether to notify error
};
const ERROR_IDS = Object.freeze({
  SPACE_CREATE_ERROR: "spaceCreateError",
  SPACE_UPDATE_ERROR: "spaceUpdateError",
  SPACE_DELETE_ERROR: "spaceDeleteError",
  SPACE_IMAGE_UPDATE_ERROR: "spaceImageUpdateError",
  SPACE_IMAGE_DELETE_ERROR: "spaceImageDeleteError",
  PROJECT_CREATE_ERROR: "projectCreateError",
  PROJECT_UPDATE_ERROR: "projectUpdateError",
  PROJECT_DELETE_ERROR: "projectDeleteError",
  INVITATION_SEND_ERROR: "invitationSendError",
  INVITATION_RESEND_ERROR: "invitationResendError",
  INVITATION_CANCEL_ERROR: "invitationCancelError",
  USER_UPDATE_ERROR: "userUpdateError",
  USER_DELETE_ERROR: "userDeleteError"
});

const handleError = (errorId, error, options = DEFAULT_OPTIONS) => {
  const { t } = i18n.global;
  const { pushNotification } = useNotifications();

  const errorMessage = t(`Errors.${errorId}`);

  if (options.log) {
    console.error(errorMessage);
    console.error(error);
  }
  if (options.notify) {
    pushNotification({
      type: "error",
      title: t("Error"),
      message: errorMessage
    });
  }
};

export function useErrors() {
  return {
    ...ERROR_IDS,
    handleError
  };
}
