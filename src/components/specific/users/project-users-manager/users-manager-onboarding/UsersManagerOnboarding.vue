<template>
  <div class="users-manager-onboarding">
    <UsersManagerOnboardingImage />
    <template v-if="project.isAdmin">
      <div>
        {{ $t("UsersManagerOnboarding.text") }}
      </div>
      <div class="users-manager-onboarding__actions">
        <BIMDataButton
          data-test-id="btn-invit"
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
import { useToggle } from "../../../../../composables/toggle.js";
// Components
import InvitationForm from "../../invitation-form/InvitationForm.vue";
import UsersManagerOnboardingImage from "./UsersManagerOnboardingImage.vue";

export default {
  components: {
    InvitationForm,
    UsersManagerOnboardingImage
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
