<template>
  <component
    :is="to ? 'AppLink' : 'button'"
    :to="to"
    type="button"
    class="dashboard-action-tile flex"
    @click="onClick"
  >
    <span class="dashboard-action-tile__title">{{ title }}</span>
    <span class="dashboard-action-tile__text">{{ text }}</span>
    <span class="dashboard-action-tile__action">
      <span class="dashboard-action-tile__action__icon">
        <slot name="icon"></slot>
      </span>
      <span class="dashboard-action-tile__action__label">{{ buttonText }}</span>
    </span>
  </component>
</template>

<script>
import AppLink from "../../app/app-link/AppLink.vue";

export default {
  components: {
    AppLink,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
    to: {
      type: Object,
      default: null,
    },
  },
  emits: ["click"],
  methods: {
    onClick(event) {
      if (!this.to) {
        this.$emit("click", event);
      }
    },
  },
};
</script>

<style scoped lang="scss" src="./DashboardActionTile.scss"></style>
