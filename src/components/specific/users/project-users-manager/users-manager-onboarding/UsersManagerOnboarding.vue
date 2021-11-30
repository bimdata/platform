<template>
  <div class="users-manager-onboarding">
    <UsersManagerOnboarding />
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
import UsersManagerOnboarding from "../../../../../../public/static/users-manager-onboarding.vue";
import { useToggle } from "@/composables/toggle";
// Components
import InvitationForm from "@/components/specific/users/invitation-form/InvitationForm";

export default {
  components: {
    UsersManagerOnboarding,
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
