<template>
  <div class="dashboard-project-list">
    <AppLink
      class="dashboard-project-list__title"
      :class="{ isCarousel }"
      :to="{ name: routeNames.userProjects }"
    >
      <span>{{ $t("DashboardProjectList.title") }}</span>
      <BIMDataIconChevron size="xxs" />
    </AppLink>
    <component
      :class="isCarousel ? '' : 'dashboard-project-list__content'"
      :is="isCarousel ? 'BIMDataCarousel' : 'div'"
    >
      <ProjectCard v-for="project in displayedProjects" :key="project.id" :project="project" />
    </component>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import ProjectCard from "../../projects/project-card/ProjectCard.vue";

export default {
  components: {
    AppLink,
    ProjectCard,
  },
  props: {
    projects: {
      type: Array,
      required: true,
    },
    isCarousel: {
      type: Boolean,
      default: false,
    },
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
      displayedProjects,
      routeNames,
    };
  },
};
</script>

<style scoped lang="scss" src="./DashboardProjectList.scss"></style>
