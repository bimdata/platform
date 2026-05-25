<script setup>
import { eachLimit } from "async";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useProjects } from "../../../../state/projects.js";
import { useAppNotification } from "../../app/app-notification/app-notification.js";

import InvitationForm from "./InvitationForm.vue";

const { t } = useI18n();
const { pushNotification } = useAppNotification();
const { sendProjectInvitation } = useProjects();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "success"]);

const errorMessage = ref("");

const submit = async ({ emails, role }) => {
  const existingEmails = props.users.map(user => user.email);

  if (emails.some(eml => existingEmails.includes(eml))) {
    errorMessage.value = t("InvitationForm.userAlreadyExistInputErrorMessage");
    return;
  }

  await eachLimit(emails, 10, async eml => {
    await sendProjectInvitation(props.project, { email: eml, role });
  });

  pushNotification({
      type: "success",
      title: t("t.success"),
      message: t("InvitationForm.successNotifText"),
  }, 2500);

  emit("success");
};
</script>

<template>
  <InvitationForm
    :role-selector="true"
    :error="errorMessage"
    @cancel="$emit('close')"
    @submit="submit"
  />
</template>
