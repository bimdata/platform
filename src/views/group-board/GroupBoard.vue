<template>
  <div class="view group-board">
    <ViewHeader class="group-board__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="group-board__header__search"
          width="300px"
          :placeholder="$t('GroupBoard.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
    </ViewHeader>

    <ResponsiveGrid itemWidth="320px">
      <GroupMemberSelectionCard :key="-1" :group="group" :users="users" />
      <GroupMemberCard
        v-for="user of displayedUsers"
        :key="user.id"
        :user="user"
      />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { computed } from "vue";
import { useListFilter } from "@/composables/list-filter";
import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import GroupMemberCard from "@/components/specific/groups/group-member-card/GroupMemberCard";
import GroupMemberSelectionCard from "@/components/specific/groups/group-member-selection-card/GroupMemberSelectionCard";

export default {
  components: {
    ResponsiveGrid,
    ViewHeader,
    AppBreadcrumb,
    GroupMemberCard,
    GroupMemberSelectionCard
  },
  setup() {
    const { projectUsers } = useProjects();
    const { currentGroup } = useGroups();

    const { filteredList: displayedUsers, searchText } = useListFilter(
      computed(() => currentGroup.value.members),
      user => `${user.firstname} ${user.lastname}`
    );

    return {
      // References
      displayedUsers,
      group: currentGroup,
      searchText,
      users: projectUsers
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupBoard.scss"></style>
