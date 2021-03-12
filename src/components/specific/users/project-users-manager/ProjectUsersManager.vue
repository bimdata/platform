<template>
  <BIMDataCard
    class="project-users-manager"
    :titleHeader="$t('ProjectBoard.ProjectUsersManager.title')"
  >
    <template #content>
      <template v-if="users.length > 1">
        <BIMDataCard class="project-users-manager__manager">
          <template #left>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="burgerMenu" size="xs" />
            </BIMDataButton>
          </template>
          <template #right>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="addUser" size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="search" size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="filter" size="xs" />
            </BIMDataButton>
          </template>
          <template #content>
            <div class="project-users-manager__list-container">
              <transition-group name="item-list">
                <InvitationCard
                  v-for="invitation in invitations"
                  :key="`invitation-${invitation.id}`"
                  :invitation="invitation"
                  :project="project"
                />
                <UserCard
                  v-for="user in displayedUsers"
                  :key="`user-${user.id}`"
                  :user="user"
                  :project="project"
                />
              </transition-group>
            </div>
          </template>
        </BIMDataCard>
      </template>
      <template v-else>
        <EmptyUsersManager :project="project" />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import EmptyUsersManager from "@/components/specific/users/empty-users-manager/EmptyUsersManager";
import InvitationCard from "@/components/specific/users/invitation-card/InvitationCard";
import UserCard from "@/components/specific/users/user-card/UserCard";

export default {
  components: {
    BIMDataButton,
    BIMDataCard,
    BIMDataIcon,
    EmptyUsersManager,
    InvitationCard,
    UserCard
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    invitations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const displayedUsers = ref([]);
    watchEffect(() => {
      displayedUsers.value = props.users;
    });

    return {
      // References
      displayedUsers
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectUsersManager.scss"></style>
