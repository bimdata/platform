<template>
  <span class="model-status-cell" :class="`model-status-cell--${statusName}`">
    <div class="status-icon"></div>
    <span>
      {{ statusName === "completed" ? "ok" : statusName }}
    </span>
  </span>
</template>

<script>
import { onUnmounted, ref, watch } from "vue";
import { MODEL_STATUS } from "../../../../../config/models.js";
import { useModels } from "../../../../../state/models.js";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { fetchModelByID, loadProjectModels } = useModels();

    const statusName = ref("");
    const statusIcon = ref("");

    // A model is considered completed as soon as one of its two
    // status (status and fragments_status) is completed.
    const globalStatus = (model) =>
      MODEL_STATUS.COMPLETED === model.status || MODEL_STATUS.COMPLETED === model.fragments_status
        ? MODEL_STATUS.COMPLETED
        : model.status;

    const isProcessing = (model) =>
      [MODEL_STATUS.PENDING, MODEL_STATUS.IN_PROGRESS].includes(model.status) ||
      [MODEL_STATUS.PENDING, MODEL_STATUS.IN_PROGRESS].includes(model.fragments_status);

    const setStatus = (status) => {
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
        setStatus(globalStatus(props.model));

        if (isProcessing(props.model)) {
          // If model status is PENDING or IN_PROGRESS then check for status
          // every 2 seconds until it's neither PENDING nor IN_PROGRESS.
          checkStatusInterval = setInterval(async () => {
            const model = await fetchModelByID(props.project, props.model.id);
            if (!isProcessing(model)) {
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
      statusName,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelStatusCell.scss"></style>
