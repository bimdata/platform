<template>
  <div class="view project-groups">
    <ViewHeader class="project-groups__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="project-groups__header__search"
          width="300px"
          :placeholder="$t('ProjectGroups.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
    </ViewHeader>

    <ResponsiveGrid itemWidth="320px">
      <GroupCreationCard v-if="project.isAdmin" :key="-1" :project="project" />
      <GroupCard v-for="group of groups" :key="group.id" :group="group" />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter";
import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import GroupCard from "@/components/specific/groups/group-card/GroupCard";
import GroupCreationCard from "@/components/specific/groups/group-creation-card/GroupCreationCard";

export default {
  components: {
    ResponsiveGrid,
    ViewHeader,
    AppBreadcrumb,
    GroupCard,
    GroupCreationCard
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
      searchText
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
