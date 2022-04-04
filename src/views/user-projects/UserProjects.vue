<template>
  <div data-test="user-projects" class="view user-projects">
    <ViewHeader class="user-projects__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="user-projects__header__search"
          width="300px"
          :placeholder="$t('UserProjects.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <!-- <BIMDataButton
          data-test="btn-filter"
          class="user-projects__header__btn-filter"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton> -->
        <BIMDataButton
          data-test="btn-sort"
          class="user-projects__header__btn-sort"
          fill
          squared
          icon
          @click="sortProjects"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
      </template>
    </ViewHeader>

    <BIMDataResponsiveGrid itemWidth="320px" rowGap="36px" columnGap="36px">
      <transition-group name="grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </transition-group>
    </BIMDataResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter.js";
import { useListSort } from "@/composables/list-sort.js";
import { useProjects } from "@/state/projects.js";
// Components
import ViewHeader from "@/components/specific/app/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard.vue";

export default {
  components: {
    AppBreadcrumb,
    ViewHeader,
    ProjectCard
  },
  setup() {
    const { userProjects } = useProjects();

    const { filteredList: displayedProjects, searchText } = useListFilter(
      userProjects,
      project => project.name
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      project => project.name
    );

    return {
      // References
      projects: displayedProjects,
      searchText,
      // Methods
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./UserProjects.scss"></style>
