<template>
  <div class="project-bcf flex">
    Some stats here
    <BcfTopic :project="project" />
  </div>
</template>

<script>
import { useProjects } from "@/state/projects.js";

// Components
import BcfTopic from "./BcfTopic.vue";

export default {
  components: {
    BcfTopic
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
