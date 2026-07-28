<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleClass}`">
    {{ $t(`UserRoleBadge.${badgeKey}`) }}
  </span>
</template>

<script>
import { computed } from "vue";
import { PROJECT_ROLE } from "../../../../config/projects.js";
import { SPACE_ROLE } from "../../../../config/spaces.js";

export default {
  props: {
    cloudRole: {
      type: Number,
      default: null,
    },
    projectRole: {
      type: Number,
      default: null,
    },
    isSpaceRole: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const roleClass = computed(() =>
      badgeKey.value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    );

    const badgeKey = computed(() => {
      if (props.cloudRole === SPACE_ROLE.ADMIN) {
        return "spaceAdmin";
      }

      if (props.projectRole === PROJECT_ROLE.ADMIN) {
        return "projectAdmin";
      }

      if (props.isSpaceRole) {
        return "spaceUser";
      }

      if (props.projectRole === PROJECT_ROLE.GUEST) {
        return "guest";
      }

      return "projectUser";
    });

    return {
      badgeKey,
      roleClass,
    };
  },
};
</script>

<style scoped lang="scss" src="./UserRoleBadge.scss"></style>
