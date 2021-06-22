<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleName}`">
    {{ $t(`UserRoleBadge.${roleName}`) }}
  </span>
</template>

<script>
import { computed } from "vue";
import { SPACE_ROLE, PROJECT_ROLE } from "@/utils/users";

export default {
  props: {
    role: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const roleName = computed(() => {
      switch (props.role) {
        case SPACE_ROLE.ADMIN:
        case PROJECT_ROLE.ADMIN:
          return "admin";
        case SPACE_ROLE.USER:
        case PROJECT_ROLE.USER:
          return "user";
        case PROJECT_ROLE.GUEST:
        default:
          return "guest";
      }
    });

    return {
      roleName
    };
  }
};
</script>

<style scoped lang="scss" src="./UserRoleBadge.scss"></style>
