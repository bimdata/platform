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

    <BIMDataResponsiveGrid itemWidth="320px" rowGap="36px" columnGap="36px">
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
import { useListFilter } from "@/composables/list-filter.js";
import { useGroups } from "@/state/groups.js";
import { useProjects } from "@/state/projects.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import GroupCard from "@/components/specific/groups/group-card/GroupCard.vue";
import GroupCreationCard from "@/components/specific/groups/group-creation-card/GroupCreationCard.vue";

export default {
  components: {
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
