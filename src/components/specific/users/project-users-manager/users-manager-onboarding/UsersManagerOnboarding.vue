<template>
  <div class="users-manager-onboarding">
    <img width="260" height="260" src="/static/users-manager-onboarding.svg" />
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

<style scoped lang="scss" src="./UsersManagerOnboarding.scss"></style>
