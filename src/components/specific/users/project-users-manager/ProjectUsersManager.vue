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
              data-test-id="btn-invit"
              v-if="project.isAdmin"
              ghost
              rounded
              icon
              @click="toggleInvitationForm"
            >
              <BIMDataIconAddUser size="xs" />
            </BIMDataButton>
            <BIMDataButton ghost rounded icon @click="toggleUserSearch">
              <BIMDataIconSearch size="xs" />
            </BIMDataButton>
          </template>
          <template #content>
            <div class="project-users-manager__list-container">
              <transition-group name="list">
                <BIMDataSearch
                  v-if="showUserSearch"
                  ref="searchInput"
                  key="user-search"
                  :placeholder="$t('t.search')"
                  v-model="searchText"
                  clear
                />

                <InvitationForm
                  v-if="showInvitationForm"
                  key="invitation-form"
                  :project="project"
                  :users="users"
                  @close="closeInvitationForm"
                  @success="onInvitationSuccess"
                />

                <template v-for="user in displayedUsers">
                  <InvitationCard
                    v-if="!user.sub"
                    :key="`invitation-${user.id}`"
                    :project="project"
                    :invitation="user"
                  />
                  <UserCard
                    v-else
                    :key="`user-${user.id}`"
                    :project="project"
                    :user="user"
                  />
                </template>
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
import { computed, nextTick, ref } from "vue";
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
      computed(() => props.invitations.concat(props.users.filter(user => user.user_id))),
      ({ firstname, lastname, email }) => [firstname, lastname, email].join(" ")
    );

    const {
      isOpen: showInvitationForm,
      close: closeInvitationForm,
      toggle: toggleInvitationForm
    } = useToggle();

    const searchInput = ref(null);
    const showUserSearch = ref(false);
    const toggleUserSearch = () => {
      searchText.value = "";
      showUserSearch.value = !showUserSearch.value;
      if (showUserSearch.value) nextTick(() => searchInput.value.focus());
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
      searchInput,
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
