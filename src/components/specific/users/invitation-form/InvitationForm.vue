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
        @keyup.enter.stop="submit"
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
      width="80px"
      ghost
      radius
      @click="close"
    >
      {{ $t("InvitationForm.cancelButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      class="invitation-form__btn-submit"
      width="80px"
      color="primary"
      fill
      radius
      @click="submit"
    >
      {{ $t("InvitationForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

export default {
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
    const { locale, t } = useI18n();
    const { sendSpaceInvitation } = useSpaces();
    const { sendProjectInvitation } = useProjects();

    const roles = ref([]);
    const role = ref(null);
    watch(
      () => locale.value,
      () => {
        roles.value = [
          { value: 100, name: t("InvitationForm.roles.admin") },
          { value: 50, name: t("InvitationForm.roles.user") },
          { value: 25, name: t("InvitationForm.roles.guest") }
        ];
        role.value = roles.value[0];
      },
      { immediate: true }
    );

    const emailInput = ref(null);
    const email = ref("");
    const error = ref(false);

    const reset = () => {
      email.value = "";
      error.value = false;
    };

    const submit = async () => {
      if (email.value) {
        try {
          if (props.project) {
            await sendProjectInvitation(props.project, {
              email: email.value,
              role: role.value.value
            });
          } else if (props.space) {
            await sendSpaceInvitation(props.space, {
              email: email.value
            });
          }
          reset();
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
      reset();
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
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./InvitationForm.scss"></style>
