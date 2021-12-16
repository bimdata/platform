<template>
  <div class="project-bcf">
    <BIMDataCard class="bcf-manager" titleHeader="BCF">
      <template #content>
        <ProjectBcfOnboardingImage />
        <div>Project BCF view, coming soon...</div>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects.js";
// Components
import ProjectBcfOnboardingImage from "./ProjectBcfOnboardingImage.vue";

export default {
  components: {
    ProjectBcfOnboardingImage
  },
  setup() {
    const { currentProject } = useProjects();

    return {
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
