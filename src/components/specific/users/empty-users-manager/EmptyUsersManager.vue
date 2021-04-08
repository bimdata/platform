<template>
  <div class="empty-users-manager">
    <img
      width="260"
      height="260"
      src="/static/empty-users-manager-illustration.svg"
    />
    <div>
      {{ $t("ProjectBoard.ProjectUsersManager.onboardingText") }}
    </div>
    <div class="empty-users-manager__actions">
      <BIMDataButton color="primary" fill radius @click="openInvitationForm">
        {{ $t("ProjectBoard.ProjectUsersManager.buttonInvite") }}
      </BIMDataButton>
    </div>
    <transition name="fade">
      <InvitationForm
        v-show="showInvitationForm"
        class="empty-users-manager__invitation-form"
        :project="project"
        @close="closeInvitationForm"
        @success="closeInvitationForm"
      />
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
