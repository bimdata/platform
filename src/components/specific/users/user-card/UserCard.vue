<template>
  <div data-test="user-card" class="user-card" v-click-away="resetCard">
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
        <UserAvatar :user="user" size="42" color="tertiary" />
        <div class="user-card__content__info">
          <div class="user-card__content__info__name">
            {{ fullName }}
            {{ user.isSelf ? `(${$t("UserCard.self")})` : "" }}
            <UserRoleBadge :role="role" />
          </div>
          <div class="user-card__content__info__email">
            {{ user.email }}
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
import { computed, provide, ref } from "vue";
// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import UserRoleBadge from "@/components/specific/users/user-role-badge/UserRoleBadge";
import UserCardActionMenu from "./user-card-action-menu/UserCardActionMenu";
import UserCardDeleteGuard from "./user-card-delete-guard/UserCardDeleteGuard";

export default {
  components: {
    UserAvatar,
    UserRoleBadge,
    UserCardActionMenu,
    UserCardDeleteGuard
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
    const fullName = computed(
      () => `${props.user.firstname || ""} ${props.user.lastname || ""}`
    );
    const role = computed(() =>
      props.project ? props.user.projectRole : props.user.cloudRole
    );

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
      loading.value = false;
      closeDeleteGuard();
    };

    return {
      // References
      fullName,
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
