<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleName}`">
    {{ $t(`UserRoleBadge.${roleName}`) }}
  </span>
</template>

<script>
import { computed } from "vue";
import PROJECT_ROLES from "@/config/project-roles";
import SPACE_ROLES from "@/config/space-roles";

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
        case SPACE_ROLES.ADMIN:
        case PROJECT_ROLES.ADMIN:
          return "admin";
        case SPACE_ROLES.USER:
        case PROJECT_ROLES.USER:
          return "user";
        case PROJECT_ROLES.GUEST:
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
