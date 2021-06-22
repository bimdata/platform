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
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
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
      (
        `${props.user.firstname[0] || ""}` + `${props.user.lastname[0] || ""}`
      ).toUpperCase()
    );

    return {
      initials
    };
  }
};
</script>

<style scoped lang="scss" src="./UserAvatar.scss"></style>
