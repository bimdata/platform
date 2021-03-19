<template>
  <span class="model-status-badge" :class="`model-status-badge--${statusName}`">
    <BIMDataIcon :name="statusIcon" size="s" />

    <div
      v-if="statusName === 'warning'"
      class="model-status-badge__tooltip model-status-badge__tooltip--warnings"
    >
      <div
        v-for="(warning, i) in warnings"
        :key="`warning-${i}`"
        class="model-status-badge__tooltip__message"
      >
        {{ warning }}
      </div>
    </div>

    <div
      v-if="statusName === 'error'"
      class="model-status-badge__tooltip model-status-badge__tooltip--errors"
    >
      <div
        v-for="(error, i) in errors"
        :key="`error-${i}`"
        class="model-status-badge__tooltip__message"
      >
        {{ error }}
      </div>
    </div>
  </span>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const statusName = ref("");
    const statusIcon = ref("");
    const warnings = ref([]);
    const errors = ref([]);

    watchEffect(() => {
      switch (props.model.status) {
        case "P":
          statusName.value = "pending";
          statusIcon.value = "success";
          break;
        case "I":
          statusName.value = "in-progress";
          statusIcon.value = "refresh";
          break;
        case "C":
          if (props.model.warnings.length > 0) {
            statusName.value = "warning";
            statusIcon.value = "warning";
            warnings.value = props.model.warnings;
          } else {
            statusName.value = "completed";
            statusIcon.value = "success";
          }
          break;
        case "E":
          statusName.value = "error";
          statusIcon.value = "failed";
          errors.value = props.model.errors;
          break;
      }
    });

    return {
      errors,
      statusIcon,
      statusName,
      warnings
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelStatusBadge.scss"></style>
