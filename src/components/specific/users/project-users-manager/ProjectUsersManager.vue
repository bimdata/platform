<template>
  <BIMDataCard
    class="project-users-manager"
    :titleHeader="$t('ProjectUsersManager.title')"
  >
    <template #content>
      <template v-if="users.length > 1 || invitations.length > 0">
        <BIMDataCard class="project-users-manager__manager">
          <template #right>
            <BIMDataButton
              v-if="project.isAdmin"
              ghost
              rounded
              icon
              @click="toggleInvitationForm"
            >
              <BIMDataIcon name="addUser" size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="toggleUserSearch">
              <BIMDataIcon name="search" size="xs" />
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
import { computed, ref } from "vue";
import { useListFilter } from "@/composables/list-filter";
import { useToggle } from "@/composables/toggle";
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
    const { filteredList: displayedUsers, searchText } = useListFilter(
      computed(() => props.users.filter(user => user.user_id)),
      ({ firstname, lastname, email }) => [firstname, lastname, email].join(" ")
    );

    const {
      isOpen: showInvitationForm,
      close: closeInvitationForm,
      toggle: toggleInvitationForm
    } = useToggle();

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
