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
          :placeholder="isSM ? '' : $t('t.search')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <GroupImport :project="project" />
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
          v-if="isProjectAdmin(project)"
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
import { useUser } from "../../state/user.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import GroupCard from "../../components/specific/groups/group-card/GroupCard.vue";
import GroupCreationCard from "../../components/specific/groups/group-creation-card/GroupCreationCard.vue";
import GroupImport from "../../components/specific/groups/group-import/GroupImport.vue";

export default {
  components: {
    GroupCard,
    ViewHeader,
    GroupImport,
    AppBreadcrumb,
    GroupCreationCard
  },
  setup() {
    const { isProjectAdmin } = useUser();
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
      // Methods
      isProjectAdmin,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
