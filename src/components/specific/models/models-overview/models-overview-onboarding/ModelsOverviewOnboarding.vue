<template>
  <div class="models-overview-onboarding">
    <ModelsOverviewOnboarding />
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
import ModelsOverviewOnboarding from "../../../../../../public/static/models-overview-onboarding.vue";
export default {
  components: {
    ModelsOverviewOnboarding
  },
  emits: ["open-file-uploader"]
};
</script>

<style scoped lang="scss" src="./ModelsOverviewOnboarding.scss"></style>
