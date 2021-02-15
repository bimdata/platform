<template>
  <div class="space-invitation-form">
    <BIMDataInput
      ref="emailInput"
      class="space-invitation-form__input"
      :placeholder="$t('SpaceInvitationForm.inputEmail')"
      v-model="email"
      :error="error"
      :errorMessage="$t('SpaceInvitationForm.errorMessage')"
      @keyup.enter.stop="inviteUser"
    />
    <BIMDataButton
      class="space-invitation-form__submit-btn"
      ghost
      rounded
      icon
      @click="inviteUser"
    >
      <BIMDataIcon name="validate" size="xxs" />
    </BIMDataButton>
    <BIMDataButton
      class="space-invitation-form__close-btn"
      ghost
      rounded
      icon
      @click="close"
    >
      <BIMDataIcon name="close" size="xxs" />
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { inviteSpaceUser } = useSpaces();

    const emailInput = ref(null);
    const email = ref("");
    const error = ref(false);
    const inviteUser = () => {
      if (email.value) {
        inviteSpaceUser(props.space, email.value)
          .then(() => emit("success"))
          .catch(error => emit("error", error));
      } else {
        emailInput.value.focus();
        error.value = true;
      }
    };

    const close = () => {
      error.value = false;
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => emailInput.value.focus(), 200);
    });

    return {
      // References
      email,
      emailInput,
      error,
      // Methods
      close,
      inviteUser
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceInvitationForm.scss"></style>
