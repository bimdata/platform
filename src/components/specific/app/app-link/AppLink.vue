<template>
  <router-link class="app-link" :to="to" :target="target">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    target: {
      type: String,
      default: () => ""
    }
  }
};
</script>

<style scoped>
.app-link {
  text-decoration: none;
  color: inherit;
}
</style>
