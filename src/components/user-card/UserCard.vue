<template>
  <div class="user-card">
    <div class="user-card__avatar">
      {{ initials }}
    </div>
    <div class="user-card__info">
      <div class="user-card__info__name">
        {{ `${firstName} ${lastName}` }}
        <span class="admin-badge" v-if="isAdmin">Admin</span>
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

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
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
    const isAdmin = ref(false);
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.toUpperCase()
    );
    watchEffect(() => {
      if (props.user) {
        firstName.value = props.user.firstname || " ";
        lastName.value = props.user.lastname || " ";
        email.value = props.user.email || "";
        isAdmin.value = props.user.cloudRole === 100;
      }
    });

    return {
      // References
      email,
      firstName,
      initials,
      isAdmin,
      lastName
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCard.scss"></style>
