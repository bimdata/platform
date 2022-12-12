<template>
  <div data-test-id="view-project-groups" class="view project-groups">
    <ViewHeader class="project-groups__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          class="project-groups__header__search"
          :width="isSM ? '150px' : '300px'"
          :placeholder="isSM ? '' : $t('ProjectGroups.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
    </ViewHeader>

    <BIMDataResponsiveGrid
      itemWidth="320px"
      rowGap="36px"
      columnGap="36px"
      :style="{ justifyContent: isMD ? 'center' : '' }"
    >
      <transition-group name="grid">
        <GroupCreationCard
          v-if="project.isAdmin"
          :key="-1"
          :project="project"
        />
        <GroupCard
          v-for="group of groups"
          :key="group.id"
          :project="project"
          :group="group"
        />
      </transition-group>
    </BIMDataResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "../../composables/list-filter.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useGroups } from "../../state/groups.js";
import { useProjects } from "../../state/projects.js";
// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import GroupCard from "../../components/specific/groups/group-card/GroupCard.vue";
import GroupCreationCard from "../../components/specific/groups/group-creation-card/GroupCreationCard.vue";

export default {
  components: {
    AppBreadcrumb,
    GroupCard,
    GroupCreationCard,
    ViewHeader
  },
  setup() {
    const { currentProject } = useProjects();
    const { projectGroups } = useGroups();

    const { filteredList: displayedGroups, searchText } = useListFilter(
      projectGroups,
      group => group.name
    );

    return {
      // References
      groups: displayedGroups,
      project: currentProject,
      searchText,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
