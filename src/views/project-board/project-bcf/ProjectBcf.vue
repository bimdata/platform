<template>
  <div class="project-bcf">
    <BIMDataCard class="models-overview" titleHeader="BCF">
      <template #content>
        <BcfManagerOnboarding />
        <div>Project BCF view, coming soon...</div>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects";

import BcfManagerOnboarding from "../../../../public/static/bcf-manager-onboarding.vue";

export default {
  components: {
    BcfManagerOnboarding
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
