<template>
  <router-link
    class="app-link"
    :class="{ disabled }"
    :to="disabled ? '' : to"
    :target="target"
  >
    <slot></slot>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  target: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.app-link {
  text-decoration: none;
  color: inherit;

  &.disabled {
    pointer-events: none;
  }
}
</style>
