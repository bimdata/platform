<template>
  <div
    class="user-avatar"
    :class="`user-avatar--${user.profile_picture ? 'silver-light' : color}`"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${initialsSize ? initialsSize : +size * 0.382}px`,
    }"
  >
    <template v-if="user.profile_picture">
      <img :src="user.profile_picture" />
    </template>
    <template v-else-if="initials">
      {{ initials }}
    </template>
    <template v-else>
      <BIMDataIconUser size="s" />
    </template>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 32,
      validate: (value) => value >= 32,
    },
    initialsSize: {
      type: [Number, String],
    },
    color: {
      type: String,
      default: "primary",
      validate: (value) => ["primary", "secondary", "silver-light"].includes(value),
    },
  },
  setup(props) {
    /* eslint-disable */
    const initials = computed(() =>
      (
        `${(props.user.firstname && props.user.firstname[0]) || ""}` +
        `${(props.user.lastname && props.user.lastname[0]) || ""}`
      ).toUpperCase(),
    );
    /* eslint-enable */

    return {
      initials,
    };
  },
};
</script>

<style scoped lang="scss" src="./UserAvatar.scss"></style>
