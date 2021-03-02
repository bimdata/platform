<template>
  <div class="project-action-bar">
    <BIMDataButton ghost rounded icon>
      <BIMDataIcon name="show" size="s" />
    </BIMDataButton>

    <BIMDataButton
      v-if="project.isAdmin"
      color="default"
      ripple
      rounded
      icon
      @click="$emit('open-menu')"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["open-menu"]
};
</script>

<style scoped lang="scss" src="./ProjectActionBar.scss"></style>
