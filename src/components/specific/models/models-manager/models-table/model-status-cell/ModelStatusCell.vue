<template>
  <span class="model-status-cell" :class="`model-status-cell--${statusName}`">
    <BIMDataSpinner v-if="['pending', 'in-progress'].includes(statusName)" />
    <BIMDataIcon v-else :name="statusIcon" size="s" />
  </span>
</template>

<script>
import { onUnmounted, ref, watch } from "vue";
import { MODEL_STATUS } from "@/config/models.js";
import { useModels } from "@/state/models.js";

export default {
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
    const { fetchModelByID, loadProjectModels } = useModels();

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

    let checkStatusInterval = null;
    watch(
      () => props.model,
      () => {
        clearInterval(checkStatusInterval);
        setStatus(props.model.status);

        if (
          MODEL_STATUS.PENDING === props.model.status ||
          MODEL_STATUS.IN_PROGRESS === props.model.status
        ) {
          // If model status is PENDING or IN_PROGRESS then check for status
          // every 2 seconds until it's neither PENDING nor IN_PROGRESS.
          checkStatusInterval = setInterval(async () => {
            const model = await fetchModelByID(props.project, props.model.id);
            if (
              MODEL_STATUS.PENDING !== model.status &&
              MODEL_STATUS.IN_PROGRESS !== model.status
            ) {
              clearInterval(checkStatusInterval);
              loadProjectModels(props.project);
            }
          }, 2000);
        }
      },
      { immediate: true }
    );

    onUnmounted(() => {
      clearInterval(checkStatusInterval);
    });

    return {
      statusIcon,
      statusName
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelStatusCell.scss"></style>
