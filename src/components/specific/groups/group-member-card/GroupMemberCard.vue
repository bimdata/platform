<template>
  <BIMDataCard data-test-id="group-member-card" class="group-member-card">
    <template #content>
      <BIMDataButton
        data-test-id="btn-remove-member"
        class="group-member-card__btn-remove"
        ghost
        rounded
        icon
        @click="remove"
      >
        <BIMDataIconDelete size="s" fill color="high" />
      </BIMDataButton>
      <UserAvatar :user="user" size="64" />
      <div class="group-member-card__info">
        <div class="group-member-card__info__name">
          {{ user.user_id ? fullName(user) : user.email }}
        </div>
        <div class="group-member-card__info__email">
          {{ user.user_id ? user.email : $t("GroupMemberCard.pending") }}
        </div>
      </div>
    </template>
  </BIMDataCard>
</template>

<script setup>
import { useGroups } from "../../../../state/groups.js";
import { fullName } from "../../../../utils/users.js";
// Components
import UserAvatar from "../../users/user-avatar/UserAvatar.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  group: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
});

const { setCurrentGroup, removeGroupMembers } = useGroups();

const remove = async () => {
  await removeGroupMembers(props.project, props.group, [props.user]);
  setCurrentGroup(props.group.id); // Needed to reload member list
};
</script>

<style scoped src="./GroupMemberCard.css"></style>
