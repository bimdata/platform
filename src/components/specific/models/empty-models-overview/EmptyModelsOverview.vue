<template>
  <div class="empty-models-overview">
    <img
      width="260"
      height="260"
      src="/static/empty-models-overview-illustration.svg"
    />
    <div>
      {{ $t("EmptyModelsOverview.onboardingText") }}
    </div>
    <div class="empty-models-overview__actions">
      <BIMDataButton
        color="primary"
        fill
        radius
        @click="$emit('open-file-uploader')"
      >
        {{ $t("EmptyModelsOverview.uploadButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  emits: ["open-file-uploader"]
};
</script>

<style scoped lang="scss" src="./EmptyModelsOverview.scss"></style>
