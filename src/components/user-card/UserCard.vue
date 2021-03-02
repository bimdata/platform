<template>
  <div class="user-card">
    <div class="user-card__avatar">
      {{ initials }}
    </div>
    <div class="user-card__info">
      <div class="user-card__info__name">
        {{ `${firstName} ${lastName}` }}
        <UserRoleBadge :role="role" />
      </div>
      <div class="user-card__info__email">
        {{ email }}
      </div>
    </div>
    <UserActionMenu :user="user" />
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
// Components
import UserActionMenu from "@/components/user-action-menu/UserActionMenu";
import UserRoleBadge from "@/components/user-role-badge/UserRoleBadge";

export default {
  components: {
    UserActionMenu,
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

    return {
      // References
      email,
      firstName,
      initials,
      lastName,
      role
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCard.scss"></style>
