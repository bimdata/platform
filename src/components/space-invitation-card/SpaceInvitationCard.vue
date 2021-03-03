<template>
  <div class="space-invitation-card">
    <div class="sapce-invitation-card__avatar">
      <img src="/static/invitation-avatar.svg" />
    </div>
    <div class="space-invitation-card__info">
      <div class="invitation-card__info__email">
        {{ invitation.email }}
      </div>
      <div class="space-invitation-card__info__text">
        {{ $t("Invitation.pending") }}
        <a @click="resendInvitation">{{ $t("Invitation.sendAgain") }}</a>
      </div>
    </div>
    <BIMDataButton
      class="space-invitation-card__cancel-btn"
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
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    invitation: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      currentSpace,
      sendSpaceInvitation,
      cancelSpaceInvitation
    } = useSpaces();

    const resendInvitation = () => {
      sendSpaceInvitation(currentSpace.value, props.invitation.email, {
        resend: true
      });
    };
    const cancelInvitation = () => {
      cancelSpaceInvitation(currentSpace.value, props.invitation);
    };

    return {
      cancelInvitation,
      resendInvitation
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceInvitationCard.scss"></style>
