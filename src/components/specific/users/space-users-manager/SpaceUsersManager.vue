<template>
  <div class="space-users-manager">
    <BIMDataTabs
      width="100%"
      height="40px"
      tabSize="50%"
      :tabs="tabs"
      :selected="currentTab"
      @tab-click="selectTab"
    />

    <BIMDataSearch
      width="100%"
      :placeholder="$t('SpaceUsersManager.searchInputPlaceholder')"
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
        <span>{{ $t("SpaceUsersManager.addUserButtonText") }}</span>
      </BIMDataButton>
    </transition>

    <div class="list-container">
      <transition-group name="list">
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
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { SPACE_ROLE } from "@/utils/users";
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
    const { locale, t } = useI18n();

    const tabs = ref([]);
    const currentTab = ref("admins");
    watch(
      locale,
      () => {
        tabs.value = [
          { id: "admins", label: t("SpaceUsersManager.tabs.admins") },
          { id: "users", label: t("SpaceUsersManager.tabs.users") }
        ];
      },
      { immediate: true }
    );
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    const admins = ref([]);
    const users = ref([]);
    watch(
      () => props.users,
      () => {
        admins.value = props.users.filter(
          user => user.cloudRole === SPACE_ROLE.ADMIN
        );
        users.value = props.users.filter(
          user => user.cloudRole === SPACE_ROLE.USER
        );
      },
      { immediate: true }
    );

    const list = computed(() =>
      currentTab.value === "admins" ? admins.value : users.value
    );
    const displayedUsers = ref([]);
    const searchText = ref("");
    const filterUsers = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedUsers.value = list.value.filter(
          ({ firstname, lastname, email }) =>
            [firstname, lastname, email].join(" ").toLowerCase().includes(text)
        );
      } else {
        displayedUsers.value = list.value;
      }
    };
    watch(
      [list, searchText],
      () => {
        filterUsers(searchText.value);
      },
      { immediate: true }
    );

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
