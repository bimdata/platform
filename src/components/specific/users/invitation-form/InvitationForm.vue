<template>
  <div class="invitation-form">
    <div class="invitation-form__input">
      <BIMDataInput
        ref="emailInput"
        class="invitation-form__input__email"
        :placeholder="$t('InvitationForm.emailInputPlaceholder')"
        v-model="email"
        :error="hasError"
        :errorMessage="$t('InvitationForm.emailInputErrorMessage')"
        @keyup.enter.stop="submit"
        margin="0px"
      />
      <BIMDataSelect
        v-if="project"
        class="invitation-form__input__role"
        width="180px"
        :label="$t('InvitationForm.roleInputLabel')"
        :options="roleOptions"
        optionKey="label"
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
import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { PROJECT_ROLE } from "../../../../config/projects.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { debounce } from "../../../../utils/async.js";

const roleList = [
  { id: "admin", value: PROJECT_ROLE.ADMIN },
  { id: "user", value: PROJECT_ROLE.USER },
  { id: "guest", value: PROJECT_ROLE.GUEST }
];

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
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { locale, t } = useI18n();
    const { pushNotification } = useAppNotification();
    const { sendSpaceInvitation } = useSpaces();
    const { sendProjectInvitation } = useProjects();

    const roleOptions = ref([]);
    const role = ref(null);
    watch(
      [() => props.space, () => props.project, () => locale.value],
      () => {
        let availableRoles = roleList;

        roleOptions.value = availableRoles.map(r => ({
          ...r,
          label: t(`InvitationForm.roles.${r.id}`)
        }));

        role.value = roleOptions.value[0];
      },
      { immediate: true }
    );

    const emailInput = ref(null);
    const email = ref("");
    const hasError = ref(false);

    const reset = () => {
      email.value = "";
      hasError.value = false;
    };

    const submit = debounce(async () => {
      if (email.value) {
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
        pushNotification({
          type: "success",
          title: t("Success"),
          message: t("InvitationForm.successNotifText")
        });
        reset();
        emit("success");
      } else {
        emailInput.value.focus();
        hasError.value = true;
      }
    }, 500);

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
      hasError,
      role,
      roleOptions,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./InvitationForm.scss"></style>
