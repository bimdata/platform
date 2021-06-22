<template>
  <div class="models-overview-onboarding">
    <img
      width="260"
      height="260"
      src="/static/models-overview-onboarding.svg"
    />
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
export default {
  emits: ["open-file-uploader"]
};
</script>

<style scoped lang="scss" src="./ModelsOverviewOnboarding.scss"></style>
