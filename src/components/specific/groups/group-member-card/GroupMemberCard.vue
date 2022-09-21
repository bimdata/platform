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
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useGroups } from "../../../../state/groups.js";
// Components
import UserAvatar from "../../users/user-avatar/UserAvatar.vue";

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
    const { t } = useI18n();
    const { setCurrentGroup, removeGroupMembers } = useGroups();

    const fullName = computed(() => {
      if (props.user.user_id) {
        return `${props.user.firstname || ""} ${props.user.lastname || ""}`;
      }
      return t("GroupMemberCard.pending");
    });

    const remove = async () => {
      await removeGroupMembers(props.project, props.group, [props.user]);
      setCurrentGroup(props.group.id); // Needed to reload member list
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
