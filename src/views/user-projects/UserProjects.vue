<template>
  <div data-test-id="view-user-projects" class="view user-projects">
    <ViewHeader class="user-projects__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-guide="project-input-search"
          class="user-projects__header__search"
          :width="isSM ? '150px' : '300px'"
          :placeholder="isSM ? '' : $t('t.search')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <StatusFilterButton
          :projects="userProjects"
          @update:filteredProjects="filteredProjects = $event"
        />
        <BIMDataButton
          class="user-projects__header__btn-sort"
          fill
          squared
          icon
          @click="sortProjects"
        >
          <BIMDataIconAlphabeticalSort size="s" />
        </BIMDataButton>
      </template>
    </ViewHeader>

    <BIMDataResponsiveGrid
      itemWidth="320px"
      rowGap="36px"
      columnGap="36px"
      :style="{ justifyContent: isMD ? 'center' : '' }"
    >
      <transition-group name="grid">
        <ProjectCard
          data-guide="project-card"
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </transition-group>
    </BIMDataResponsiveGrid>
  </div>
</template>

<script>
import { ref } from "vue";
import { useListFilter } from "../../composables/list-filter.js";
import { useListSort } from "../../composables/list-sort.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useProjects } from "../../state/projects.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import ProjectCard from "../../components/specific/projects/project-card/ProjectCard.vue";
import StatusFilterButton from "../../components/specific/projects/status-filter-button/StatusFilterButton.vue";

export default {
  components: {
    AppBreadcrumb,
    ViewHeader,
    ProjectCard,
    StatusFilterButton
  },
  setup() {
    const { userProjects } = useProjects();
    const filteredProjects = ref(userProjects.value);

    const { filteredList: displayedProjects, searchText } = useListFilter(
      filteredProjects,
      (project) => project.name + project.description ?? ""
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      (project) => project.name + project.description ?? ""
    );

    return {
      // References
      userProjects,
      filteredProjects,
      projects: displayedProjects,
      searchText,
      // Methods
      sortProjects,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
};
</script>

<style scoped lang="scss" src="./UserProjects.scss"></style>
