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
    <BIMDataButton outline radius icon color="primary">
      <BIMDataIcon name="plus" size="xxxs" />
      <span>{{ $t("SpaceUsersManager.addUserButton") }}</span>
    </BIMDataButton>
    <div class="list-container">
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
import UserCard from "@/components/user-card/UserCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    BIMDataTabs,
    UserCard
  },
  setup() {
    const { currentSpace, currentSpaceAdmins, currentSpaceUsers } = useSpaces();

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

    return {
      // Refrences
      displayedUsers,
      searchText,
      space: currentSpace,
      tabs,
      // Methods
      swicthUserList
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
