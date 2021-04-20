<template>
  <span class="model-status-cell" :class="`model-status-cell--${statusName}`">
    <BIMDataSpinner v-if="['pending', 'in-progress'].includes(statusName)" />
    <BIMDataIcon v-else :name="statusIcon" size="s" />
  </span>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useModels } from "@/state/models";
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
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { fetchModelByID, softUpdateModels } = useModels();

    const statusName = ref("");
    const statusIcon = ref("");

    const setStatus = status => {
      switch (status) {
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
    };

    watchEffect(() => {
      setStatus(props.model.status);

      if (
        MODEL_STATUS.PENDING === props.model.status ||
        MODEL_STATUS.IN_PROGRESS === props.model.status
      ) {
        // If model status is PENDING or IN_PROGRESS then check for status
        // every 2 seconds until it's COMPLETED or ERROR.
        let checkInterval = null;
        checkInterval = setInterval(async () => {
          const model = await fetchModelByID(props.project, props.model.id);
          if (
            MODEL_STATUS.PENDING !== model.status &&
            MODEL_STATUS.IN_PROGRESS !== model.status
          ) {
            clearInterval(checkInterval);
            softUpdateModels(model);
          }
        }, 2000);
      }
    });

    return {
      statusIcon,
      statusName
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelStatusCell.scss"></style>
