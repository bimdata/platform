<template>
  <span class="user-role-badge" :class="`user-role-badge--${roleName}`">
    {{ $t(`User.${roleName}`) }}
  </span>
</template>

<script>
import { ref, watchEffect } from "vue";

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
        case 100:
          roleName.value = "admin";
          break;
        case 50:
          roleName.value = "user";
          break;
        case 25:
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
