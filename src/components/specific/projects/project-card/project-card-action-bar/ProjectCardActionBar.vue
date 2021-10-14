<template>
  <div class="project-card-action-bar">
    <BIMDataButton
      data-test="btn-open-viewer"
      class="project-card-action-bar__action-btn"
      ghost
      rounded
      icon
      :disabled="models.length === 0"
      @click.stop="$emit('open-viewer')"
    >
      <BIMDataIcon name="show" size="s" />
    </BIMDataButton>

    <BIMDataButton
      v-if="project.isAdmin"
      data-test="btn-open-menu"
      class="project-card-action-bar__action-btn"
      color="default"
      ripple
      rounded
      icon
      @click.stop="$emit('open-menu')"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  },
  emits: ["open-viewer", "open-menu"]
};
</script>

<style scoped lang="scss" src="./ProjectCardActionBar.scss"></style>
