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
      <InvitationForm
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
          <InvitationCard
            v-for="invitation in invitations"
            :key="`invitation-${invitation.id}`"
            :invitation="invitation"
            :space="space"
          />
        </template>
        <UserCard
          v-for="user in displayedUsers"
          :key="`user-${user.id}`"
          :user="user"
          :space="space"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import InvitationCard from "@/components/specific/users/invitation-card/InvitationCard";
import InvitationForm from "@/components/specific/users/invitation-form/InvitationForm";
import UserCard from "@/components/specific/users/user-card/UserCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    BIMDataTabs,
    InvitationCard,
    InvitationForm,
    UserCard
  },
  props: {
    space: {
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
    const { t } = useI18n();

    const tabs = ref([]);
    const currentTab = ref("admins");
    watchEffect(() => {
      tabs.value = [
        { id: "admins", label: t("SpaceUsersManager.adminTabLabel") },
        { id: "users", label: t("SpaceUsersManager.userTabLabel") }
      ];
    });
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    let admins = [];
    let users = [];
    const list = ref([]);
    const displayedUsers = ref([]);
    watchEffect(() => {
      admins = props.users.filter(user => user.cloudRole === 100);
      users = props.users.filter(user => user.cloudRole === 50);
    });
    watchEffect(() => {
      list.value = currentTab.value === "admins" ? admins : users;
      displayedUsers.value = list.value;
    });

    const searchText = ref("");
    const filterUsers = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedUsers.value = list.value.filter(
          ({ firstname, lastname, email }) =>
            [firstname, lastname, email]
              .join(" ")
              .toLowerCase()
              .includes(text)
        );
      } else {
        displayedUsers.value = list.value;
      }
    };
    watchEffect(() => filterUsers(searchText.value));

    const showInvitations = computed(() => currentTab.value === "admins");

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
      searchText,
      showInvitationForm,
      showInvitations,
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
