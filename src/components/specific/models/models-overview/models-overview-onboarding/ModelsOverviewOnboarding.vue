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
        :disabled="isProjectGuest(project)"
        @click="$emit('open-file-uploader')"
      >
        {{ $t("ModelsOverviewOnboarding.uploadButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { useProjects } from "../../../../../state/projects.js";
import { useUser } from "../../../../../state/user.js";
// Components
import ModelsOverviewOnboardingImage from "./ModelsOverviewOnboardingImage.vue";

defineEmits(["open-file-uploader"]);

const { isProjectGuest } = useUser();
const { currentProject: project } = useProjects();
</script>

<style scoped lang="scss" src="./ModelsOverviewOnboarding.scss"></style>
