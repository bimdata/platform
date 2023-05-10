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
        :disabled="project.isGuest"
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
import { useProjects } from "../../../../../state/projects.js";

export default {
  components: {
    ModelsOverviewOnboardingImage
  },
  emits: ["open-file-uploader"],
  setup() {
    const { currentProject } = useProjects();

    return { project: currentProject };
  }
};
</script>

<style scoped lang="scss" src="./ModelsOverviewOnboarding.scss"></style>
