<template>
  <div class="invitation-form">
    <BIMDataInput
      ref="emailInput"
      class="invitation-form__input"
      :placeholder="$t('InvitationForm.inputEmail')"
      v-model="email"
      :error="error"
      :errorMessage="$t('InvitationForm.errorMessage')"
      @keyup.enter.stop="inviteUser"
    />
    <BIMDataButton
      class="invitation-form__btn-cancel"
      ghost
      radius
      @click="close"
    >
      {{ $t("InvitationForm.buttonCancel") }}
    </BIMDataButton>
    <BIMDataButton
      class="invitation-form__btn-submit"
      color="primary"
      fill
      radius
      @click="inviteUser"
    >
      {{ $t("InvitationForm.buttonSubmit") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";

export default {
  components: {
    BIMDataButton,
    BIMDataInput
  },
  props: {
    space: {
      type: Object,
      default: null
    },
    project: {
      type: Object,
      default: null
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { sendSpaceInvitation } = useSpaces();
    const { sendProjectInvitation } = useProjects();

    const emailInput = ref(null);
    const email = ref("");
    const error = ref(false);
    const inviteUser = async () => {
      if (email.value) {
        try {
          if (props.project) {
            await sendProjectInvitation(props.project, {
              email: email.value,
              role: null
            });
          } else if (props.space) {
            await sendSpaceInvitation(props.space, { email: email.value });
          }
          emit("success");
        } catch (error) {
          emit("error", error);
        }
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

<style scoped lang="scss" src="./InvitationForm.scss"></style>
