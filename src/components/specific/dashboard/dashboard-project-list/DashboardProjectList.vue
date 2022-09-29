<template>
  <div class="dashboard-project-list">
    <div class="dashboard-project-list__title" :class="{ isCarousel }">
      {{ $t("DashboardProjectList.title") }}
    </div>
    <component
      :class="isCarousel ? '' : 'dashboard-project-list__content'"
      :is="isCarousel ? 'BIMDataCarousel' : 'div'"
    >
      <ProjectCard
        v-for="project in displayedProjects"
        :key="project.id"
        :project="project"
        :actionMenu="false"
      />
    </component>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import ProjectCard from "../../projects/project-card/ProjectCard.vue";

export default {
  components: {
    ProjectCard
  },
  props: {
    projects: {
      type: Array,
      required: true
    },
    isCarousel: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const displayedProjects = ref([]);

    watchEffect(() => {
      if (props.projects) {
        displayedProjects.value = props.projects
          .slice()
          .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
          .slice(0, 10);
      }
    });

    return {
      displayedProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardProjectList.scss"></style>
