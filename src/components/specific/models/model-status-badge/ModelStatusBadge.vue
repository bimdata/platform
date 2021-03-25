<template>
  <span class="model-status-badge" :class="`model-status-badge--${statusName}`">
    <BIMDataSpinner v-if="['pending', 'in-progress'].includes(statusName)" />
    <BIMDataIcon v-else :name="statusIcon" size="s" />
  </span>
</template>

<script>
import { ref, watchEffect } from "vue";
import { MODEL_STATUS } from "@/utils/models";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";

export default {
  components: {
    BIMDataIcon,
    BIMDataSpinner
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

    watchEffect(() => {
      switch (props.model.status) {
        case MODEL_STATUS.PENDING:
          statusName.value = "pending";
          break;
        case MODEL_STATUS.IN_PROGRESS:
          statusName.value = "in-progress";
          break;
        case MODEL_STATUS.COMPLETED:
          statusName.value = "completed";
          statusIcon.value = "success";
          break;
        case MODEL_STATUS.ERROR:
          statusName.value = "error";
          statusIcon.value = "failed";
          break;
      }
    });

    return {
      statusIcon,
      statusName
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelStatusBadge.scss"></style>
