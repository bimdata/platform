<template>
  <div class="projects-view">
    <div class="sub-header">
      <div class="sub-header--left">
        <AppBreadcrumb />
      </div>
      <div class="sub-header--center">
        <BIMDataSearch
          width="300px"
          :placeholder="$t('Projects.searchProjects')"
          v-model="searchText"
          clear
        />
      </div>
      <div class="sub-header--right">
        <BIMDataButton fill squared icon>
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton>
        <BIMDataButton fill squared icon @click="sortProjects">
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
      </div>
    </div>

    <div class="list-container">
      <transition-group name="card-list">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";

export default {
  components: {
    AppBreadcrumb,
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    ProjectCard
  },
  setup() {
    const { userProjects } = useProjects();

    const displayedProjects = ref([]);
    watchEffect(() => (displayedProjects.value = userProjects.value));

    const searchText = ref("");
    const filterProjects = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedProjects.value = userProjects.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedProjects.value = userProjects.value;
      }
    };
    watchEffect(() => filterProjects(searchText.value));

    let sortOrder = "none";
    const sortProjects = () => {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
      const n = sortOrder === "desc" ? -1 : 1;
      displayedProjects.value = displayedProjects.value
        .slice()
        .sort((a, b) => (a.name < b.name ? -1 : 1) * n);
    };

    return {
      // References
      projects: displayedProjects,
      searchText,
      // Methods
      filterProjects,
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./Projects.scss"></style>
