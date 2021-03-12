<template>
  <div class="user-card" v-click-away="resetCard">
    <transition name="fade" mode="out-in">
      <div class="user-card__loader" v-if="loading">
        <BIMDataSpinner />
      </div>

      <UserCardDeleteGuard
        v-else-if="showDeleteGuard"
        :user="user"
        :space="space"
        :project="project"
        @close="closeDeleteGuard"
      />

      <div class="user-card__content" v-else>
        <div class="user-card__content__avatar">
          <template v-if="initials">
            {{ initials }}
          </template>
          <BIMDataIcon v-else name="user" size="s" />
        </div>
        <div class="user-card__content__info">
          <div class="user-card__content__info__name">
            {{ `${firstName} ${lastName}` }}
            {{ user.isSelf ? `(${$t("User.self")})` : "" }}
            <UserRoleBadge :role="role" />
          </div>
          <div class="user-card__content__info__email">
            {{ email }}
          </div>
        </div>
        <UserCardActionMenu
          v-if="!user.isSelf"
          @open-update="() => {}"
          @open-delete="openDeleteGuard"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, provide, ref, watchEffect } from "vue";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import UserCardActionMenu from "@/components/specific/users/user-card-action-menu/UserCardActionMenu";
import UserCardDeleteGuard from "@/components/specific/users/user-card-delete-guard/UserCardDeleteGuard";
import UserRoleBadge from "@/components/specific/users/user-role-badge/UserRoleBadge";

export default {
  components: {
    BIMDataIcon,
    BIMDataSpinner,
    UserCardActionMenu,
    UserCardDeleteGuard,
    UserRoleBadge
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    space: {
      type: Object,
      default: null
    },
    project: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const role = ref(0);
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.trim().toUpperCase()
    );
    watchEffect(() => {
      if (props.user) {
        firstName.value = props.user.firstname || " ";
        lastName.value = props.user.lastname || " ";
        email.value = props.user.email || "";
        role.value = props.user.cloudRole;
      }
    });

    const loading = ref(false);
    provide("loading", loading);

    const showDeleteGuard = ref(false);
    const openDeleteGuard = () => {
      showDeleteGuard.value = true;
    };
    const closeDeleteGuard = () => {
      showDeleteGuard.value = false;
    };

    const resetCard = () => {
      closeDeleteGuard();
      loading.value = false;
    };

    return {
      // References
      email,
      firstName,
      initials,
      lastName,
      loading,
      role,
      showDeleteGuard,
      // Methods
      closeDeleteGuard,
      openDeleteGuard,
      resetCard
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCard.scss"></style>
