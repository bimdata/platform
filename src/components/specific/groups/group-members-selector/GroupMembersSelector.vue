<script setup>
import { computed } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
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
  users: {
    type: Object,
    required: true
  }
});

const { setCurrentGroup, addGroupMembers } = useGroups();

const availableUsers = computed(() => {
  const memberIDs = props.group.members.map(u => u.id);
  return props.users.filter(u => !memberIDs.includes(u.id));
});

const { filteredList: displayedUsers, searchText } = useListFilter(
  availableUsers,
  ({ firstname, lastname, email }) => [firstname, lastname, email].join(" ")
);

const addMember = async user => {
  await addGroupMembers(props.project, props.group, [user]);
  setCurrentGroup(props.group.id); // Needed to reload member list
};
</script>

<template>
  <div class="group-members-selector">
    <BIMDataSearch
      width="100%"
      :placeholder="$t('t.search')"
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
              {{ user.user_id ? fullName(user) : user.email }}
            </div>
            <div class="user-add-card__info__email">
              {{ user.user_id ? user.email : $t("GroupMemberCard.pending") }}
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
            <BIMDataIconPlus size="s" />
          </BIMDataButton>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.group-members-selector {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 2);
  padding-top: var(--spacing-unit);

  .bimdata-search-bar {
    min-height: 32px;
    background-color: var(--color-silver-light);
    &.focus {
      background-color: var(--color-white);
    }
  }

  .list-container {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) / 2);
    overflow-x: hidden;
    overflow-y: auto;

    .user-add-card {
      display: flex;
      align-items: center;
      min-height: 64px;
      height: 64px;
      padding-right: calc(var(--spacing-unit) / 2);

      .user-add-card__info {
        flex-grow: 1;
        padding: 0 var(--spacing-unit);
        line-height: 18px;

        .user-add-card__info__name {
          font-weight: bold;
        }

        .user-add-card__info__email {
          font-size: 12px;
          color: var(--color-granite-light);
        }
      }
    }
  }
}
</style>
