<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleName}`">
    <template v-if="roleName === 'guest'">
      {{ $t("UserRoleBadge.guest") }}
    </template>
    <template v-if="role === 100">
      {{ $t(`UserRoleBadge.spaceAdmin`) }}
    </template>
    <template v-if="isSpaceRole && roleName === 'spaceUser'">
      {{ $t(`UserRoleBadge.spaceUser`) }}
    </template>
    <template v-if="!isSpaceRole && roleName === 'projectUser'">
      {{ $t(`UserRoleBadge.projectUser`) }}
    </template>
  </span>
</template>

<script>
import { computed } from "vue";
import { PROJECT_ROLE } from "../../../../config/projects.js";
import { SPACE_ROLE } from "../../../../config/spaces.js";

export default {
  props: {
    role: {
      type: Number,
      required: true,
    },
    isSpaceRole: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const roleName = computed(() => {
      switch (props.role) {
        case SPACE_ROLE.ADMIN:
          return props.isSpaceRole ? "spaceAdmin" : "projectAdmin";
        case SPACE_ROLE.USER:
          return props.isSpaceRole ? "spaceUser" : "projectUser";
        case PROJECT_ROLE.GUEST:
        default:
          return "guest";
      }
    });

    return {
      roleName,
    };
  },
};
</script>

<style scoped lang="scss" src="./UserRoleBadge.scss"></style>
