<template>
  <div class="users-manager-onboarding">
    <img width="260" height="260" src="/static/users-manager-onboarding.svg" />
    <template v-if="project.isAdmin">
      <div>
        {{ $t("UsersManagerOnboarding.text") }}
      </div>
      <div class="users-manager-onboarding__actions">
        <BIMDataButton
          width="120px"
          color="primary"
          fill
          radius
          @click="openInvitationForm"
        >
          {{ $t("UsersManagerOnboarding.inviteButtonText") }}
        </BIMDataButton>
      </div>
    </template>
    <transition name="fade">
      <div
        v-show="showInvitationForm"
        class="users-manager-onboarding__overlay"
      >
        <InvitationForm
          class="users-manager-onboarding__overlay__invitation-form"
          :project="project"
          @close="closeInvitationForm"
          @success="closeInvitationForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import InvitationForm from "@/components/specific/users/invitation-form/InvitationForm";

export default {
  components: {
    BIMDataButton,
    InvitationForm
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    const {
      isOpen: showInvitationForm,
      open: openInvitationForm,
      close: closeInvitationForm
    } = useToggle();

    return {
      // References
      showInvitationForm,
      // Methods
      closeInvitationForm,
      openInvitationForm
    };
  }
};
</script>

<style scoped lang="scss" src="./UsersManagerOnboarding.scss"></style>
