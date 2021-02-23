<template>
  <div class="space-users-manager">
    <BIMDataTabs
      width="100%"
      height="40px"
      tabSize="50%"
      :tabs="tabs"
      :selected="0"
      @tab-click="swicthUserList"
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
      <SpaceInvitationCard
        v-for="invitation in invitations"
        :key="invitation.id"
        :invitation="invitation"
      />
      <transition-group name="item-list">
        <UserCard v-for="user in displayedUsers" :key="user.id" :user="user" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import SpaceInvitationCard from "@/components/space-invitation-card/SpaceInvitationCard";
import SpaceInvitationForm from "@/components/space-invitation-form/SpaceInvitationForm";
import UserCard from "@/components/user-card/UserCard";

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

    const userList = ref(currentSpaceAdmins.value);
    const displayedUsers = ref([]);
    watchEffect(() => {
      displayedUsers.value = userList.value;
    });

    const swicthUserList = tab => {
      userList.value =
        tab.id === "admins"
          ? currentSpaceAdmins.value
          : currentSpaceUsers.value;
    };

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
      displayedUsers,
      invitations: currentSpaceInvitations,
      searchText,
      showInvitationForm,
      space: currentSpace,
      tabs,
      // Methods
      closeInvitationForm,
      openInvitationForm,
      swicthUserList
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
