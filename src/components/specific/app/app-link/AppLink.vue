<template>
  <router-link class="app-link" :to="to">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true
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
