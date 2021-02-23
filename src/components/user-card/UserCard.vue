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
      <div class="user-card__info__email">{{ email }}</div>
    </div>
    <BIMDataButton class="user-card__menu-btn" ripple rounded icon>
      <BIMDataIcon name="ellipsis" size="l" class="fill-tertiary-dark" />
    </BIMDataButton>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import UserRoleBadge from "@/components/user-role-badge/UserRoleBadge";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
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
