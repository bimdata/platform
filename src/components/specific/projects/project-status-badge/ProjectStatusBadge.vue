<template>
  <div class="project-status-badge" :class="`project-status-badge--${status}`">
    {{ $t(`ProjectStatusBadge.${status}`) }}
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="scss" src="./ProjectStatusBadge.scss"></style>
