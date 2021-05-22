<template>
  <div class="file-actions-cell">
    <BIMDataButton ghost rounded icon @click="() => {}">
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
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
