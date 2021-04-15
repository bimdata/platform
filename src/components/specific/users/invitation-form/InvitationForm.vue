<template>
  <div class="invitation-form">
    <div class="invitation-form__input">
      <BIMDataInput
        ref="emailInput"
        class="invitation-form__input__email"
        :placeholder="$t('InvitationForm.emailInputPlaceholder')"
        v-model="email"
        :error="error"
        :errorMessage="$t('InvitationForm.emailInputErrorMessage')"
        @keyup.enter.stop="inviteUser"
      />
      <BIMDataSelect
        v-if="project"
        class="invitation-form__input__role"
        :label="$t('InvitationForm.roleInputLabel')"
        :options="roles"
        optionKey="name"
        v-model="role"
      />
    </div>
    <BIMDataButton
      class="invitation-form__btn-cancel"
      ghost
      radius
      @click="close"
    >
      {{ $t("InvitationForm.cancelButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      class="invitation-form__btn-submit"
      color="primary"
      fill
      radius
      @click="inviteUser"
    >
      {{ $t("InvitationForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSelect.js";

export default {
  components: {
    BIMDataButton,
    BIMDataInput,
    BIMDataSelect
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
    const { t } = useI18n();
    const { sendSpaceInvitation } = useSpaces();
    const { sendProjectInvitation } = useProjects();

    const emailInput = ref(null);
    const email = ref("");
    const error = ref(false);

    const roles = ref([]);
    const role = ref(null);
    watchEffect(() => {
      roles.value = [
        { value: 100, name: t("InvitationForm.roles.admin") },
        { value: 50, name: t("InvitationForm.roles.user") },
        { value: 25, name: t("InvitationForm.roles.guest") }
      ];
      role.value = roles.value[0];
    });

    const inviteUser = async () => {
      if (email.value) {
        try {
          if (props.project) {
            await sendProjectInvitation(props.project, {
              email: email.value,
              role: role.value.value
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
      role,
      roles,
      // Methods
      close,
      inviteUser
    };
  }
};
</script>

<style scoped lang="scss" src="./InvitationForm.scss"></style>
