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
      <template #right>
        <BIMDataButton
          fill
          square
          icon
          style="padding: 6px; width: 170px"
          @click="open"
        >
          <BIMDataIcon name="group" size="xs" margin="0 6px 0 0" />
          <span>Importer un groupe</span>
          <BIMDataIcon
            name="chevron"
            size="xxs"
            margin="0 0 0 auto"
            :rotate="isOpen ? 90 : 0"
          />
        </BIMDataButton>
        <template v-if="isOpen">
          <BIMDataMenu
            class="project-groups__menu"
            isClickAway
            childrenLeft
            :menuItems="projectsToDisplay"
            v-click-away="close"
          >
            <!-- <template #header>
              <BIMDataCheckbox
                style="width: 14px; margin: 0 6px 0 0"
                :modelValue="options.length === checkedItems.length"
                @update:modelValue="checkAllItems"
              />
              <span>Tout sélectionner</span>
            </template> -->
            <!-- <template #item="{ item }">
              <BIMDataCheckbox
                style="width: 14px; margin: 0 6px 0 0"
                :modelValue="checkedItems.includes(item.text)"
                @update:modelValue="checkItem(item)"
              />
              <span>{{ item.text }}</span>
            </template> -->
            <!-- <template #footer>AUREVOIR</template> -->
          </BIMDataMenu>
        </template>
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
import { ref } from "vue";
import { useListFilter } from "../../composables/list-filter.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useGroups } from "../../state/groups.js";
import { useProjects } from "../../state/projects.js";
import { useToggle } from "../../composables/toggle.js";
import GroupService from "../../services/GroupService.js";

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
    const { currentProject, spaceProjects } = useProjects();
    const { projectGroups } = useGroups();
    const { isOpen, close, open } = useToggle();

    const { filteredList: displayedGroups, searchText } = useListFilter(
      projectGroups,
      group => group.name
    );

    console.log("projectGroups", projectGroups);

    const projectsToDisplay = spaceProjects.value
      .filter(({ isAdmin }) => isAdmin)
      .map(p => ({
        ...p,
        text: p.name,
        children: { list: [{ name: "coucou" }] }
      }));

    const checkedItems = ref([]);

    const checkItem = ({ text }) => {
      const isChecked = this.checkedItems.includes(text);

      if (isChecked) {
        const itemIndex = this.checkedItems.indexOf(text);
        this.checkedItems.splice(itemIndex, 1);
      } else {
        this.checkedItems.push(text);
      }
      return !isChecked;
    };

    const checkAllItems = () => {
      this.checkedItems =
        this.checkedItems.length === this.options.length
          ? []
          : this.options.map(item => item.text);
    };

    return {
      // References
      groups: displayedGroups,
      project: currentProject,
      searchText,
      projectsToDisplay,
      checkedItems,
      // methods
      console,
      open,
      close,
      isOpen,
      checkItem,
      checkAllItems,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectGroups.scss"></style>
