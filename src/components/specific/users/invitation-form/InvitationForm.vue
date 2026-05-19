<template>
  <div class="invitation-form">
    <div class="invitation-form__input">
      <BIMDataInput
        data-test-id="input-email"
        ref="emailInput"
        class="invitation-form__input__email"
        :placeholder="$t('InvitationForm.emailInputPlaceholder')"
        v-model="email"
        :error="errorMessage !== ''"
        :errorMessage="errorMessage"
        @keyup.enter.stop="submit"
        margin="0px"
      />
      <BIMDataSelect
        v-if="roleSelector"
        class="invitation-form__input__role"
        width="180px"
        :label="$t('InvitationForm.roleInputLabel')"
        :options="roleOptions"
        optionKey="label"
        v-model="role"
      />
    </div>
    <BIMDataButton class="invitation-form__btn-cancel" width="80px" ghost radius @click="cancel">
      {{ $t("t.cancel") }}
    </BIMDataButton>
    <BIMDataButton
      data-test-id="btn-submit-invit"
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
import { PROJECT_ROLE } from "../../../../config/projects.js";
import { debounce } from "../../../../utils/async.js";
import { parseEmails } from "../../../../utils/users.js";

const roleList = [
  { id: "admin", value: PROJECT_ROLE.ADMIN },
  { id: "user", value: PROJECT_ROLE.USER },
  { id: "guest", value: PROJECT_ROLE.GUEST },
];

export default {
  props: {
    roleSelector: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: ""
    }
  },
  emits: ["cancel", "submit"],
  setup(props, { emit }) {
    const { locale, t } = useI18n();

    const emailInput = ref(null);
    const email = ref("");

    const roleOptions = ref([]);
    const role = ref(null);
    watch(
      locale,
      () => {
        let availableRoles = roleList;

        roleOptions.value = availableRoles.map((r) => ({
          ...r,
          label: t(`InvitationForm.roles.${r.id}`),
        }));

        role.value = roleOptions.value[0];
      },
      { immediate: true }
    );

    const errorMessage = ref("");
    watch(
      () => props.error,
      msg => {
        errorMessage.value = msg;
      },
      { immediate: true }
    );

    const reset = () => {
      email.value = "";
      errorMessage.value = "";
    };

    const submit = debounce(async () => {
      errorMessage.value = "";

      if (!email.value) {
        emailInput.value.focus();
        errorMessage.value = t("InvitationForm.emailInputErrorMessage");
        return;
      }

      const emails = parseEmails(email.value);

      emit("submit", { emails, role: role.value.value });
      reset();
    }, 500);

    const cancel = () => {
      emit("cancel");
      reset();
    };

    onMounted(() => {
      setTimeout(() => emailInput.value.focus(), 200);
    });

    return {
      // References
      email,
      emailInput,
      errorMessage,
      role,
      roleOptions,
      // Methods
      cancel,
      submit,
    };
  },
};
</script>

<style scoped lang="scss" src="./InvitationForm.scss"></style>
