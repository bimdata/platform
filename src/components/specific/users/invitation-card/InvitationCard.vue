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
    const { sendSpaceInvitation, cancelSpaceInvitation } = useSpaces();
    const { sendProjectInvitation, cancelProjectInvitation } = useProjects();

    const resendInvitation = () => {
      if (props.project) {
        sendProjectInvitation(props.project, props.invitation, {
          resend: true
        });
      } else if (props.space) {
        sendSpaceInvitation(props.space, props.invitation.email, {
          resend: true
        });
      }
    };
    const cancelInvitation = () => {
      if (props.project) {
        cancelProjectInvitation(props.project, props.invitation);
      } else if (props.space) {
        cancelSpaceInvitation(props.space, props.invitation);
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
