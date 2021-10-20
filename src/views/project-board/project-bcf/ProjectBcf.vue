<template>
  <div class="project-bcf">
    <BIMDataCard class="bcf-manager" titleHeader="BCF">
      <template #content>
        <img
          width="260"
          height="260"
          src="/static/bcf-manager-onboarding.svg"
        />
        <div>Project BCF view, coming soon...</div>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects";

export default {
  setup() {
    const { currentProject } = useProjects();

    return {
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
