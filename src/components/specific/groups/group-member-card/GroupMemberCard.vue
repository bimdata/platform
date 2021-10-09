<template>
  <BIMDataCard class="group-member-card">
    <template #content>
      <BIMDataButton
        class="group-member-card__btn-remove"
        ghost
        rounded
        icon
        @click="remove"
      >
        <BIMDataIcon name="delete" size="s" fill color="high" />
      </BIMDataButton>
      <UserAvatar :user="user" size="64" />
      <div class="group-member-card__info">
        <div class="group-member-card__info__name">
          {{ fullName }}
        </div>
        <div class="group-member-card__info__email">
          {{ user.email }}
        </div>
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { computed } from "vue";
import { useGroups } from "@/state/groups.js";
// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar.vue";

export default {
  components: {
    UserAvatar
  },
  props: {
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
  },
  setup(props) {
    const { selectGroup, removeGroupMembers } = useGroups();

    const fullName = computed(
      () => `${props.user.firstname || ""} ${props.user.lastname || ""}`
    );

    const remove = async () => {
      await removeGroupMembers(props.project, props.group, [props.user]);
      selectGroup(props.group.id); // Needed to reload member list
    };

    return {
      // References
      fullName,
      // Methods
      remove
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupMemberCard.scss"></style>
