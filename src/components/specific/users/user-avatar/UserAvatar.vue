<template>
  <div
    class="user-avatar"
    :class="`user-avatar--${user.profilePicture ? 'tertiary' : color}`"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${+size * 0.382}px`
    }"
  >
    <template v-if="user.profilePicture">
      <img :src="user.profilePicture" />
    </template>
    <template v-else-if="initials">
      {{ initials }}
    </template>
    <template v-else>
      <BIMDataIcon name="user" size="s" />
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
      default: 32,
      validate: value => value >= 32
    },
    color: {
      type: String,
      default: "primary",
      validate: value => ["primary", "secondary", "tertiary"].includes(value)
    }
  },
  setup(props) {
    /* eslint-disable */
    const initials = computed(
      () => (
        `${props.user.firstname && props.user.firstname[0] || ""}`
        + `${props.user.lastname && props.user.lastname[0] || ""}`
      ).toUpperCase()
    );
    /* eslint-enable */

    return {
      initials
    };
  }
};
</script>

<style scoped lang="scss" src="./UserAvatar.scss"></style>
