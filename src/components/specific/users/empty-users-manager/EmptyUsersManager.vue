<template>
  <div class="empty-users-manager">
    <img
      width="260"
      height="260"
      src="/static/empty-users-manager-illustration.svg"
    />
    <div>
      {{ $t("EmptyUsersManager.onboardingText") }}
    </div>
    <div class="empty-users-manager__actions">
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="openInvitationForm"
      >
        {{ $t("EmptyUsersManager.inviteButtonText") }}
      </BIMDataButton>
    </div>
    <transition name="fade">
      <div v-show="showInvitationForm" class="empty-users-manager__overlay">
        <InvitationForm
          class="empty-users-manager__overlay__invitation-form"
          :project="project"
          @close="closeInvitationForm"
          @success="closeInvitationForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
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
    const showInvitationForm = ref(false);
    const openInvitationForm = () => {
      showInvitationForm.value = true;
    };
    const closeInvitationForm = () => {
      showInvitationForm.value = false;
    };

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

<style scoped lang="scss" src="./EmptyUsersManager.scss"></style>
