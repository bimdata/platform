<template>
  <div data-test-id="invitation-card" class="invitation-card">
    <div class="invitation-card__avatar">
      <InvitationAvatarImage />
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
      <BIMDataIconDelete size="xs" />
    </BIMDataButton>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { wait } from "../../../../utils/async.js";

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
    const { pushNotification } = useAppNotification();
    const {
      sendSpaceInvitation,
      cancelSpaceInvitation,
      loadSpaceUsers,
      loadSpaceInvitations
    } = useSpaces();
    const {
      sendProjectInvitation,
      cancelProjectInvitation,
      loadProjectUsers,
      loadProjectInvitations
    } = useProjects();

    const resendInvitation = async () => {
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

      await wait(2000);
      if (props.project) {
        loadProjectUsers(props.project);
        loadProjectInvitations(props.project);
      } else if (props.space) {
        loadSpaceUsers(props.space);
        loadSpaceInvitations(props.space);
      }
    };

    const cancelInvitation = async () => {
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
    };

    return {
      cancelInvitation,
      resendInvitation
    };
  }
};
</script>

<style scoped lang="scss" src="./InvitationCard.scss"></style>
