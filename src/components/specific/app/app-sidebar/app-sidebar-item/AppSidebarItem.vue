<template>
  <BIMDataTooltip
    class="app-sidebar-item"
    :text="label"
    position="right"
    color="primary"
  >
    <AppLink
      v-if="to"
      class="app-sidebar-item__target"
      :to="to"
      :data-test-id="dataTestId"
    >
      <span class="app-sidebar-item__icon">
        <slot />
        <span v-if="notif" class="app-sidebar-item__notif"></span>
      </span>
    </AppLink>
    <button
      v-else
      type="button"
      class="app-sidebar-item__target"
      :data-test-id="dataTestId"
      @click="$emit('click')"
    >
      <span class="app-sidebar-item__icon">
        <slot />
        <span v-if="notif" class="app-sidebar-item__notif"></span>
      </span>
    </button>
  </BIMDataTooltip>
</template>

<script setup>
import AppLink from "../../app-link/AppLink.vue";

defineProps({
  label: {
    type: String,
    default: ""
  },
  to: {
    type: [String, Object],
    default: null
  },
  notif: {
    type: Boolean,
    default: false
  },
  dataTestId: {
    type: String,
    default: ""
  }
});

defineEmits(["click"]);
</script>

<style scoped lang="scss" src="./AppSidebarItem.scss"></style>
