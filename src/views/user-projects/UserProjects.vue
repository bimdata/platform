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
        <BIMDataButton
          data-test="btn-filter"
          class="user-projects__header__btn-filter"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton>
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

    <ResponsiveGrid itemWidth="320px">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter";
import { useListSort } from "@/composables/list-sort";
import { useProjects } from "@/state/projects";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";

export default {
  components: {
    ResponsiveGrid,
    ViewHeader,
    AppBreadcrumb,
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
