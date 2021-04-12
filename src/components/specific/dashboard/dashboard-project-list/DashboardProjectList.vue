<template>
  <div class="dashboard-project-list">
    <div class="dashboard-project-list__title">
      {{ $t("DashboardProjectList.title") }}
    </div>
    <CarouselList>
      <ProjectCard
        v-for="project in displayedProjects"
        :key="project.id"
        :project="project"
        :actionMenu="false"
      />
    </CarouselList>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import CarouselList from "@/components/generic/carousel-list/CarouselList";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";

export default {
  components: {
    CarouselList,
    ProjectCard
  },
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const displayedProjects = ref([]);

    watchEffect(() => {
      if (props.projects) {
        displayedProjects.value = props.projects
          .slice()
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 5);
      }
    });

    return {
      displayedProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardProjectList.scss"></style>
