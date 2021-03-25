<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleName}`">
    {{ $t(`User.${roleName}`) }}
  </span>
</template>

<script>
import { ref, watchEffect } from "vue";
import { SPACE_ROLE, PROJECT_ROLE } from "@/utils/users";

export default {
  props: {
    role: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const roleName = ref("");

    watchEffect(() => {
      switch (props.role) {
        case SPACE_ROLE.ADMIN:
        case PROJECT_ROLE.ADMIN:
          roleName.value = "admin";
          break;
        case SPACE_ROLE.USER:
        case PROJECT_ROLE.USER:
          roleName.value = "user";
          break;
        case PROJECT_ROLE.GUEST:
          roleName.value = "guest";
          break;
      }
    });

    return {
      roleName
    };
  }
};
</script>

<style scoped lang="scss" src="./UserRoleBadge.scss"></style>
