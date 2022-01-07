<template>
  <div class="project-bcf__content flex m-t-36">
    <div
      class="project-bcf__content__metrics flex items-center justify-center"
      style="width: 701px; background-color: white"
    >
      Some stats here
    </div>
    <BcfTopics
      v-for="bcfTopic in bcfTopics"
      :key="bcfTopic.index"
      :project="project"
      :bcfTopic="bcfTopic"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useProjects } from "@/state/projects.js";
import { useBcf } from "@/state/bcf.js";

// Components
import BcfTopics from "../../../components/specific/bcf/bcf-topics/BcfTopics.vue";

export default {
  components: {
    BcfTopics
  },
  setup() {
    const { currentProject } = useProjects();
    const { loadBcfTopics } = useBcf();
    const bcfTopics = ref([]);

    watch(
      () => currentProject.value,
      async () => {
        bcfTopics.value = await loadBcfTopics(currentProject.value);
      },
      { immediate: true }
    );

    return {
      project: currentProject,
      bcfTopics
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
