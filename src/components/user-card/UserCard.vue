<template>
  <div class="user-card" v-click-away="resetCard">
    <transition name="fade" mode="out-in">
      <div class="user-card__loader" v-if="loading">
        <BIMDataSpinner />
      </div>

      <UserDeleteGuard
        v-else-if="showDeleteGuard"
        :user="user"
        @close="closeDeleteGuard"
      />

      <div class="user-card__content" v-else>
        <div class="user-card__content__avatar">
          {{ initials }}
        </div>
        <div class="user-card__content__info">
          <div class="user-card__content__info__name">
            {{ `${firstName} ${lastName}` }}
            <UserRoleBadge :role="role" />
          </div>
          <div class="user-card__content__info__email">
            {{ email }}
          </div>
        </div>
        <UserActionMenu
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
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import UserActionMenu from "@/components/user-action-menu/UserActionMenu";
import UserDeleteGuard from "@/components/user-delete-guard/UserDeleteGuard";
import UserRoleBadge from "@/components/user-role-badge/UserRoleBadge";

export default {
  components: {
    BIMDataSpinner,
    UserActionMenu,
    UserDeleteGuard,
    UserRoleBadge
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const role = ref(0);
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.toUpperCase()
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
