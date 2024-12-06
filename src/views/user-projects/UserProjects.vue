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
        <div class="status_filter" v-click-away="close">
          <BIMDataButton
            class="user-projects__header__btn-sort"
            fill
            squared
            icon
            @click="toggle"
          >
            <BIMDataIconFilterList size="s" />
          </BIMDataButton>
          <transition name="fade">
            <div v-show="isOpen" class="status_filter-menu p-y-12 p-x-18">
              <div
                v-for="status in computedStatuses"
                :key="status"
                class="status-filter-menu__item"
              >
                <BIMDataCheckbox
                  :text="$t(`ProjectStatusBadge.${status}`)"
                  :modelValue="selectedStatuses.includes(status)"
                  @update:modelValue="(checked) => onStatusChange(status, checked)"
                />
              </div>
            </div>
          </transition>
        </div>
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
import { computed, ref } from "vue";
import { useListFilter } from "../../composables/list-filter.js";
import { useListSort } from "../../composables/list-sort.js";
import { useToggle } from "../../composables/toggle.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useProjects } from "../../state/projects.js";
import { projectStatus } from "../../utils/projects.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import ProjectCard from "../../components/specific/projects/project-card/ProjectCard.vue";

export default {
  components: {
    AppBreadcrumb,
    ViewHeader,
    ProjectCard,
  },
  setup() {
    const { isOpen, close, toggle } = useToggle();
    const { userProjects } = useProjects();

    const selectedStatuses = ref([]);

    const onStatusChange = (status, isChecked) => {
      if (isChecked) {
        if (!selectedStatuses.value.includes(status)) {
          selectedStatuses.value.push(status);
        }
      } else {
        selectedStatuses.value = selectedStatuses.value.filter((s) => s !== status);
      }
    };

    const computedStatuses = computed(() => {
      const statuses = new Set();
      userProjects.value.forEach((project) => {
        statuses.add(projectStatus(project));
      });
      return Array.from(statuses);
    });

    const filteredProjects = computed(() => {
      return userProjects.value.filter((project) => {
        if (selectedStatuses.value.length === 0) {
          return true;
        }
        return selectedStatuses.value.includes(projectStatus(project));
      });
    });

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
      projects: displayedProjects,
      searchText,
      selectedStatuses,
      computedStatuses,
      isOpen,
      // Methods
      close,
      toggle, 
      onStatusChange,
      sortProjects,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
};
</script>

<style scoped lang="scss" src="./UserProjects.scss"></style>
