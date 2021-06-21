<template>
  <div
    class="user-avatar"
    :class="`user-avatar--${color}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <template v-if="user.avatar">
      <!-- TODO: display avatar -->
      <!-- <img :src="user.avatar" /> -->
    </template>
    <template v-else>
      {{ initials }}
    </template>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: [Number, String],
      default: 32
    },
    color: {
      type: String,
      default: "primary",
      validate: value => ["primary", "secondary", "tertiary"].includes(value)
    }
  },
  setup(props) {
    const initials = computed(() =>
      `${props.user.firstname[0]}${props.user.lastname[0]}`.toUpperCase()
    );

    return {
      initials
    };
  }
};
</script>

<style scoped lang="scss" src="./UserAvatar.scss"></style>
