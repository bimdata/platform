<template>
  <div class="recent-projects-list">
    <div class="recent-projects-list__title">
      {{ $t("RecentProjectsList.title") }}
    </div>
    <div class="recent-projects-list__content">
      <ProjectCard
        v-for="project in recentProjects"
        :key="project.id"
        :project="project"
        :actionMenu="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useProjects } from "@/state/projects";
// Components
import ProjectCard from "@/components/project-card/ProjectCard";

export default {
  components: {
    ProjectCard
  },
  setup() {
    const { userProjects } = useProjects();

    const recentProjects = ref([]);

    watchEffect(() => {
      if (userProjects.value) {
        recentProjects.value = userProjects.value
          .slice()
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 4);
      }
    });

    return {
      recentProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./RecentProjectsList.scss"></style>
