<template>
  <div class="project-status-badge" :class="`project-status-badge--${status}`">
    {{ $t(`ProjectStatusBadge.${status}`) }}
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const status = computed(() => {
      const p = props.project;

      if (p.createdAt < "???") {
        return "new";
      }

      if (p.updatedAt < "???") {
        return "active";
      }

      return "inactive";
    });

    return {
      status
    };
  }
};
</script>

<style scoped lang="scss" src="./PropjectStatusBadge.scss"></style>
