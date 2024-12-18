<template>
  <div class="users-manager-onboarding">
    <UsersManagerOnboardingImage />
    <template v-if="isProjectAdmin(project)">
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

<script setup>
import { useToggle } from "../../../../../composables/toggle.js";
import { useUser } from "../../../../../state/user.js";
// Components
import InvitationForm from "../../invitation-form/InvitationForm.vue";
import UsersManagerOnboardingImage from "./UsersManagerOnboardingImage.vue";

defineProps({
  project: {
    type: Object,
    required: true
  }
});

const { isProjectAdmin } = useUser();

const {
  isOpen: showInvitationForm,
  open: openInvitationForm,
  close: closeInvitationForm
} = useToggle();
</script>

<style scoped lang="scss" src="./UsersManagerOnboarding.scss"></style>
