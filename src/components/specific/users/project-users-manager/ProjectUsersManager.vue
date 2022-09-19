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
                  @success="onInvitationSuccess"
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
import { useListFilter } from "../../../../composables/list-filter.js";
import { useToggle } from "../../../../composables/toggle.js";
import { useProjects } from "../../../../state/projects.js";
import { wait } from "../../../../utils/async.js";
// Components
import InvitationCard from "../invitation-card/InvitationCard.vue";
import InvitationForm from "../invitation-form/InvitationForm.vue";
import UserCard from "../user-card/UserCard.vue";
import UsersManagerOnboarding from "./users-manager-onboarding/UsersManagerOnboarding.vue";

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
    const { loadProjectUsers, loadProjectInvitations } = useProjects();

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

    const onInvitationSuccess = async () => {
      closeInvitationForm();
      await wait(2000);
      loadProjectUsers(props.project);
      loadProjectInvitations(props.project);
    };

    return {
      // References
      displayedUsers,
      searchText,
      showInvitationForm,
      showUserSearch,
      // Methods
      closeInvitationForm,
      onInvitationSuccess,
      toggleInvitationForm,
      toggleUserSearch
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectUsersManager.scss"></style>
