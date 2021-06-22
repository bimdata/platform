<template>
  <BIMDataCard
    class="project-users-manager"
    :titleHeader="$t('ProjectUsersManager.title')"
  >
    <template #content>
      <template v-if="users.length > 1 || invitations.length > 0">
        <BIMDataCard class="project-users-manager__manager">
          <template #left>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="burgerMenu" size="xs" />
            </BIMDataButton>
          </template>
          <template #right>
            <BIMDataButton ghost rounded icon @click="toggleInvitationForm">
              <BIMDataIcon name="addUser" size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="toggleUserSearch">
              <BIMDataIcon name="search" size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="() => {}">
              <BIMDataIcon name="filter" size="xs" />
            </BIMDataButton>
          </template>
          <template #content>
            <div class="project-users-manager__list-container">
              <transition-group name="list">
                <BIMDataSearch
                  v-if="showUserSearch"
                  key="user-search"
                  :placeholder="
                    $t('ProjectUsersManager.searchInputPlaceholder')
                  "
                  v-model="searchText"
                  clear
                />

                <InvitationForm
                  v-if="showInvitationForm"
                  key="invitation-form"
                  :project="project"
                  @close="closeInvitationForm"
                  @success="closeInvitationForm"
                />

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
        <UsersManagerOnboarding :project="project" />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "vue";
// Components
import InvitationCard from "@/components/specific/users/invitation-card/InvitationCard";
import InvitationForm from "@/components/specific/users/invitation-form/InvitationForm";
import UserCard from "@/components/specific/users/user-card/UserCard";
import UsersManagerOnboarding from "./users-manager-onboarding/UsersManagerOnboarding";

export default {
  components: {
    InvitationCard,
    InvitationForm,
    UserCard,
    UsersManagerOnboarding
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
    const searchText = ref("");
    const filterUsers = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedUsers.value = props.users.filter(
          ({ firstname, lastname, email }) =>
            [firstname, lastname, email].join(" ").toLowerCase().includes(text)
        );
      } else {
        displayedUsers.value = props.users;
      }
    };
    watch(
      [() => props.users, searchText],
      () => {
        filterUsers(searchText.value);
      },
      { immediate: true }
    );

    const showInvitationForm = ref(false);
    const toggleInvitationForm = () => {
      showInvitationForm.value = !showInvitationForm.value;
    };
    const closeInvitationForm = () => {
      showInvitationForm.value = false;
    };

    const showUserSearch = ref(false);
    const toggleUserSearch = () => {
      searchText.value = "";
      showUserSearch.value = !showUserSearch.value;
    };

    return {
      // References
      displayedUsers,
      searchText,
      showInvitationForm,
      showUserSearch,
      // Methods
      closeInvitationForm,
      toggleInvitationForm,
      toggleUserSearch
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectUsersManager.scss"></style>
