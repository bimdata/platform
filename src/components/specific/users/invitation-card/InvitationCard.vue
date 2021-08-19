<template>
  <div class="invitation-card">
    <div class="invitation-card__avatar">
      <img src="/static/invitation-avatar.svg" />
    </div>
    <div class="invitation-card__info">
      <div class="invitation-card__info__email">
        {{ invitation.email }}
      </div>
      <div class="invitation-card__info__text">
        {{ $t("InvitationCard.pendingMessage") }}
        <a @click="resendInvitation">
          {{ $t("InvitationCard.resendLinkText") }}
        </a>
      </div>
    </div>
    <BIMDataButton
      class="invitation-card__cancel-btn"
      ghost
      rounded
      icon
      @click="cancelInvitation"
    >
      <BIMDataIcon name="delete" size="xs" />
    </BIMDataButton>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useErrors } from "@/composables/errors";
import { useNotifications } from "@/composables/notifications";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

export default {
  props: {
    invitation: {
      type: Object,
      required: true
    },
    space: {
      type: Object,
      default: null
    },
    project: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n();
    const { pushNotification } = useNotifications();
    const { handleError, INVITATION_RESEND_ERROR, INVITATION_CANCEL_ERROR } =
      useErrors();
    const { sendSpaceInvitation, cancelSpaceInvitation } = useSpaces();
    const { sendProjectInvitation, cancelProjectInvitation } = useProjects();

    const resendInvitation = async () => {
      try {
        if (props.project) {
          await sendProjectInvitation(props.project, props.invitation, {
            resend: true
          });
        } else if (props.space) {
          await sendSpaceInvitation(props.space, props.invitation, {
            resend: true
          });
        }
        pushNotification({
          type: "success",
          title: t("Success"),
          message: t("InvitationCard.resendSuccessNotifText")
        });
      } catch (error) {
        handleError(INVITATION_RESEND_ERROR, error);
      }
    };

    const cancelInvitation = async () => {
      try {
        if (props.project) {
          await cancelProjectInvitation(props.project, props.invitation);
        } else if (props.space) {
          await cancelSpaceInvitation(props.space, props.invitation);
        }
        pushNotification({
          type: "success",
          title: t("Success"),
          message: t("InvitationCard.cancelSuccessNotifText")
        });
      } catch (error) {
        handleError(INVITATION_CANCEL_ERROR, error);
      }
    };

    return {
      cancelInvitation,
      resendInvitation
    };
  }
};
</script>

<style scoped lang="scss" src="./InvitationCard.scss"></style>
