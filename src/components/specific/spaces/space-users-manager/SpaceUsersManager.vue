<template>
  <div class="space-users-manager">
    <BIMDataTabs
      width="100%"
      height="40px"
      tabSize="50%"
      :tabs="tabs"
      selected="admins"
      @tab-click="selectTab"
    />

    <BIMDataSearch
      width="100%"
      :placeholder="$t('SpaceUsersManager.searchUsers')"
      v-model="searchText"
      clear
    />

    <transition name="fade" mode="out-in">
      <SpaceInvitationForm
        v-if="showInvitationForm"
        :space="space"
        @close="closeInvitationForm"
        @success="closeInvitationForm"
      />

      <BIMDataButton
        v-else
        outline
        radius
        icon
        color="primary"
        @click="openInvitationForm"
      >
        <BIMDataIcon name="plus" size="xxxs" />
        <span>{{ $t("SpaceUsersManager.addUserButton") }}</span>
      </BIMDataButton>
    </transition>

    <div class="list-container">
      <transition-group name="item-list">
        <template v-if="showInvitations">
          <SpaceInvitationCard
            v-for="invitation in invitations"
            :key="invitation.id"
            :invitation="invitation"
          />
        </template>
        <UserCard v-for="user in displayedUsers" :key="user.id" :user="user" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import SpaceInvitationCard from "@/components/specific/spaces/space-invitation-card/SpaceInvitationCard";
import SpaceInvitationForm from "@/components/specific/spaces/space-invitation-form/SpaceInvitationForm";
import UserCard from "@/components/specific/users/user-card/UserCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    BIMDataTabs,
    SpaceInvitationCard,
    SpaceInvitationForm,
    UserCard
  },
  setup() {
    const {
      currentSpace,
      currentSpaceAdmins,
      currentSpaceUsers,
      currentSpaceInvitations
    } = useSpaces();

    const tabs = [
      { id: "admins", label: "Administrateurs" },
      { id: "users", label: "Utilisateurs" }
    ];
    const currentTab = ref("admins");
    const selectTab = tab => {
      currentTab.value = tab.id;
    };
    const showInvitations = computed(() => currentTab.value === "admins");

    const userList = ref([]);
    watchEffect(() => {
      userList.value =
        currentTab.value === "admins"
          ? currentSpaceAdmins.value
          : currentSpaceUsers.value;
    });

    const displayedUsers = ref([]);
    watchEffect(() => {
      displayedUsers.value = userList.value;
    });

    const searchText = ref("");
    const filterUsers = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedUsers.value = userList.value.filter(
          ({ firstname, lastname, email }) =>
            [firstname, lastname, email]
              .join(" ")
              .toLowerCase()
              .includes(text)
        );
      } else {
        displayedUsers.value = userList.value;
      }
    };
    watchEffect(() => filterUsers(searchText.value));

    const showInvitationForm = ref(false);
    const openInvitationForm = () => {
      showInvitationForm.value = true;
    };
    const closeInvitationForm = () => {
      showInvitationForm.value = false;
    };

    return {
      // Refrences
      currentTab,
      displayedUsers,
      invitations: currentSpaceInvitations,
      searchText,
      showInvitationForm,
      showInvitations,
      space: currentSpace,
      tabs,
      // Methods
      closeInvitationForm,
      openInvitationForm,
      selectTab
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
