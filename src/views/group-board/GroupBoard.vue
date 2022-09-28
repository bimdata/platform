<template>
  <div data-test-id="view-group-board" class="view group-board">
    <ViewHeader class="group-board__header">
      <template #left>
        <GoBackButton v-if="isLG" />
        <AppBreadcrumb v-else />
      </template>
      <template #center>
        <BIMDataSearch
          class="group-board__header__search"
          :width="isSM ? '150px' : '300px'"
          :placeholder="isSM ? '' : $t('GroupBoard.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
    </ViewHeader>

    <AppSidePanel side="left" :title="$t('GroupMembersSelector.title')">
      <GroupMembersSelector :project="project" :group="group" :users="users" />
    </AppSidePanel>

    <BIMDataResponsiveGrid
      itemWidth="320px"
      rowGap="36px"
      columnGap="36px"
      :style="{ justifyContent: isMD ? 'center' : '' }"
    >
      <transition-group name="grid">
        <GroupMemberSelectionCard :key="-1" @click="openMembersSelector" />
        <GroupMemberCard
          v-for="member of displayedMembers"
          :key="member.id"
          :project="project"
          :group="group"
          :user="member"
        />
      </transition-group>
    </BIMDataResponsiveGrid>
  </div>
</template>

<script>
import { computed } from "vue";
import { useListFilter } from "../../composables/list-filter.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useAppSidePanel } from "../../components/specific/app/app-side-panel/app-side-panel.js";
import { useGroups } from "../../state/groups.js";
import { useProjects } from "../../state/projects.js";
// Components
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppSidePanel from "../../components/specific/app/app-side-panel/AppSidePanel.vue";
import GroupMemberCard from "../../components/specific/groups/group-member-card/GroupMemberCard.vue";
import GroupMemberSelectionCard from "../../components/specific/groups/group-member-selection-card/GroupMemberSelectionCard.vue";
import GroupMembersSelector from "../../components/specific/groups/group-members-selector/GroupMembersSelector.vue";

export default {
  components: {
    AppBreadcrumb,
    AppSidePanel,
    GoBackButton,
    GroupMemberCard,
    GroupMemberSelectionCard,
    GroupMembersSelector,
    ViewHeader
  },
  setup() {
    const { currentProject, projectUsers } = useProjects();
    const { currentGroup } = useGroups();
    const { openSidePanel } = useAppSidePanel();

    const { filteredList: displayedMembers, searchText } = useListFilter(
      computed(() => currentGroup.value.members),
      user => `${user.firstname} ${user.lastname}`
    );

    return {
      // References
      displayedMembers,
      group: currentGroup,
      project: currentProject,
      searchText,
      users: projectUsers,
      // Methods
      openMembersSelector: openSidePanel,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupBoard.scss"></style>
