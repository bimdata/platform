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

    <BIMDataSearch width="100%" :placeholder="$t('t.search')" v-model="searchText" clear />

    <transition name="fade" mode="out-in">
      <template v-if="showInvitationForm">
        <InvitationForm
          :currentTab="currentTab"
          :space="space"
          @close="closeInvitationForm"
          @success="onInvitationSuccess"
        />
      </template>

      <template v-else>
        <BIMDataButton outline radius color="primary" @click="openInvitationForm">
          <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
          <span>{{
            currentTab === "admins"
              ? $t("SpaceUsersManager.addAdminButtonText")
              : $t("SpaceUsersManager.addUserButtonText")
          }}</span>
        </BIMDataButton>
      </template>
    </transition>

    <div class="list-container">
      <transition-group name="list">
        <template v-for="user in displayedUsers">
          <InvitationCard
            v-if="user.from === 'invitation'"
            :key="`invitation-${user.id}`"
            :space="space"
            :invitation="user"
          />
          <UserCard v-else :key="`user-${user.id}`" :space="space" :user="user" />
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useToggle } from "../../../../composables/toggle.js";
import { SPACE_ROLE } from "../../../../config/spaces.js";
import { useSpaces } from "../../../../state/spaces.js";
import { wait } from "../../../../utils/async.js";
// Components
import InvitationCard from "../invitation-card/InvitationCard.vue";
import InvitationForm from "../invitation-form/InvitationForm.vue";
import UserCard from "../user-card/UserCard.vue";

const tabsDef = [{ id: "admins" }, { id: "users" }];

export default {
  components: {
    InvitationCard,
    InvitationForm,
    UserCard,
  },
  props: {
    space: {
      type: Object,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
    invitations: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { locale, t } = useI18n();
    const { loadSpaceUsers, loadSpaceInvitations } = useSpaces();

    const tabs = ref([]);
    const currentTab = ref(tabsDef[0].id);
    const selectTab = (tab) => (currentTab.value = tab.id);
    watch(
      () => locale.value,
      () => {
        tabs.value = tabsDef.map((tab) => ({
          ...tab,
          label: t(`SpaceUsersManager.tabs.${tab.id}`),
        }));
      },
      { immediate: true }
    );

    const admins = ref([]);
    const users = ref([]);
    watch(
      () => props.users,
      () => {
        admins.value = props.users.filter((user) => user.cloud_role === SPACE_ROLE.ADMIN);
        users.value = props.users.filter((user) => user.cloud_role === SPACE_ROLE.USER);
      },
      { immediate: true }
    );

    const list = computed(() => {
      props.invitations.forEach((invitation) => {
        invitation.from = "invitation";
      });
      if (currentTab.value === "admins") {
        admins.value.forEach((invitation) => {
          invitation.from = "user";
        });
        return props.invitations
          .filter((invitation) => invitation.role === 100)
          .concat(admins.value);
      } else {
        users.value.forEach((invitation) => {
          invitation.from = "user";
        });
        return props.invitations.filter((invitation) => invitation.role === 50).concat(users.value);
      }
    });

    const { filteredList: displayedUsers, searchText } = useListFilter(
      list,
      ({ firstname, lastname, email }) => [firstname, lastname, email].join(" ")
    );

    const {
      isOpen: showInvitationForm,
      open: openInvitationForm,
      close: closeInvitationForm,
    } = useToggle();

    const onInvitationSuccess = async () => {
      closeInvitationForm();
      await wait(2000);
      loadSpaceUsers(props.space);
      loadSpaceInvitations(props.space);
    };

    return {
      // Refrences
      currentTab,
      displayedUsers,
      searchText,
      showInvitationForm,
      tabs,
      // Methods
      closeInvitationForm,
      onInvitationSuccess,
      openInvitationForm,
      selectTab,
    };
  },
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
