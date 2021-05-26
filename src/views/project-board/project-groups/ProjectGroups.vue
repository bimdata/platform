<template>
  <div class="project-groups">
    <!-- TODO -->
    Project Groups view, coming soon...
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

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
