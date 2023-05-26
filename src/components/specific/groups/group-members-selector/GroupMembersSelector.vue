<template>
  <div class="group-members-selector">
    <BIMDataSearch
      width="100%"
      :placeholder="$t('GroupMembersSelector.searchInputPlaceholder')"
      v-model="searchText"
      clear
    />

    <div class="list-container">
      <transition-group name="list">
        <div
          data-test-id="user-list-item"
          class="user-add-card"
          v-for="user of displayedUsers"
          :key="user.id"
        >
          <UserAvatar :user="user" size="48" color="silver-light" />
          <div class="user-add-card__info">
            <div class="user-add-card__info__name">
              {{ user.fullname }}
            </div>
            <div class="user-add-card__info__email">
              {{ user.email }}
            </div>
          </div>
          <BIMDataButton
            data-test-id="btn-add-member"
            width="36px"
            height="36px"
            fill
            radius
            icon
            @click="addMember(user)"
          >
            <BIMDataIcon name="plus" size="s" />
          </BIMDataButton>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
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
    users: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const { setCurrentGroup, addGroupMembers } = useGroups();

    const availableUsers = computed(() => {
      const memberIDs = props.group.members.map(u => u.id);
      return props.users
        .filter(u => !memberIDs.includes(u.id))
        .map(x => {
          const fullname = x.user_id
            ? `${x.firstname} ${x.lastname}`
            : t("GroupMemberInvitation.name");
          return { ...x, fullname };
        });
    });

    const { filteredList: displayedUsers, searchText } = useListFilter(
      availableUsers,
      ({ firstname, lastname, email }) => [firstname, lastname, email].join(" ")
    );

    const addMember = async user => {
      await addGroupMembers(props.project, props.group, [user]);
      setCurrentGroup(props.group.id); // Needed to reload member list
    };

    return {
      // References
      displayedUsers,
      searchText,
      // Methods
      addMember
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupMembersSelector.scss"></style>
