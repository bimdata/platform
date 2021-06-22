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
import { ref, watchEffect } from "vue";
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

    const displayedGroups = ref([]);
    watchEffect(() => (displayedGroups.value = projectGroups.value));

    const searchText = ref("");
    const filterProjects = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedGroups.value = projectGroups.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedGroups.value = projectGroups.value;
      }
    };
    watchEffect(() => filterProjects(searchText.value));

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
