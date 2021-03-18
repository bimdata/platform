<template>
  <span class="model-status-badge" :class="`model-status-badge--${statusName}`">
    <BIMDataIcon :name="statusIcon" size="s" />
  </span>
</template>

<script>
import { ref } from "vue";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
  props: {
    status: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const statusName = ref("");
    const statusIcon = ref("");

    switch (props.status) {
      case "P":
        statusName.value = "pending";
        statusIcon.value = "success";
        break;
      case "I":
        statusName.value = "in-progress";
        statusIcon.value = "refresh";
        break;
      case "C":
        statusName.value = "completed";
        statusIcon.value = "success";
        break;
      case "E":
        statusName.value = "error";
        statusIcon.value = "failed";
        break;
    }

    return {
      statusIcon,
      statusName
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelStatusBadge.scss"></style>
