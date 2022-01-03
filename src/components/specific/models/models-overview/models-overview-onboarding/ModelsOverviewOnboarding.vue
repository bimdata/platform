<template>
  <div class="models-overview-onboarding">
    <ModelsOverviewOnboardingImage />
    <div>
      {{ $t("ModelsOverviewOnboarding.text") }}
    </div>
    <div class="models-overview-onboarding__actions">
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="$emit('open-file-uploader')"
      >
        {{ $t("ModelsOverviewOnboarding.uploadButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
// Components
import ModelsOverviewOnboardingImage from "./ModelsOverviewOnboardingImage.vue";

export default {
  components: {
    ModelsOverviewOnboardingImage
  },
  emits: ["open-file-uploader"]
};
</script>

<style scoped lang="scss" src="./ModelsOverviewOnboarding.scss"></style>
