<script setup>
import { eachLimit } from "async";
import { useI18n } from "vue-i18n";
import { useSpaces } from "../../../../state/spaces.js";
import { useAppNotification } from "../../app/app-notification/app-notification.js";

import InvitationForm from "./InvitationForm.vue";

const { t } = useI18n();
const { pushNotification } = useAppNotification();
const { sendSpaceInvitation, updateSpaceUser } = useSpaces();

const props = defineProps({
  space: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    default: () => [],
  },
  admin: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["close", "success"]);

const submit = async ({ emails }) => {
  let isExistingUsersOnly = true;

  await eachLimit(emails, 10, async eml => {
    const user = props.users.find(user => user.email === eml);
    if (user) {
      await updateSpaceUser(props.space, { ...user, cloud_role: 100 });
      return;
    }

    isExistingUsersOnly = false;
    if (props.admin) {
      await sendSpaceInvitation(props.space, { email: eml });
    } else {
      await sendSpaceInvitation(props.space, {
        email: eml,
        in_all_projects: true,
        project_role: 50,
        role: 50,
      });
    }
  });

  pushNotification(
    {
      type: "success",
      title: t("t.success"),
      message: t(
        isExistingUsersOnly
          ? "InvitationForm.successUserToAdmin"
          : "InvitationForm.successNotifText"
      ),
    },
    2500
  );
};
</script>

<template>
  <InvitationForm @cancel="$emit('close')" @submit="submit" />
</template>
