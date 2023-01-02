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
          style="padding: 6px; width: 200px"
          @click="openGroupImport"
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
        {{ console.log("isOpen in template", isOpen) }}
        <template v-if="isOpen">
          <BIMDataMenu
            class="project-groups__menu"
            childrenLeft
            :menuItems="projectsToDisplay"
            v-click-away="close"
          >
            <template #child-header="{ children }">
              <div class="project-groups__children-menu--header">
                <BIMDataCheckbox
                  style="width: 14px; margin: 0 6px 0 0px"
                  :modelValue="
                    checkedItems[children.project_id].length ===
                    children.list.length
                  "
                  @update:modelValue="checkAllItems(children)"
                />
                <span>Tout sélectionner</span>
              </div>
            </template>
            <template #child-item="{ child }">
              <BIMDataCheckbox
                style="width: 14px; margin: 0 6px 0 0"
                :modelValue="
                  Boolean(
                    checkedItems[child.project.id]?.find(
                      item => item.id === child.id
                    )
                  )
                "
                @update:modelValue="checkItem(child)"
              />
              <span>{{ child.text }}</span>
            </template>
            <template #child-footer>
              <BIMDataButton
                class="project-groups__children-menu--footer"
                color="primary"
                fill
                radius
                width="88%"
              >
                <span>Ajouter</span>
              </BIMDataButton>
            </template>
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

    const projectsToDisplay = ref([]);
    const checkedItems = ref({});

    const openGroupImport = async () => {
      console.log("isOpen", isOpen.value);
      if (isOpen.value) {
        close();
        return;
      }
      projectsToDisplay.value = await Promise.all(
        spaceProjects.value
          .filter(({ isAdmin }) => isAdmin)
          .map(async project => {
            checkedItems.value[project.id] = [];
            return {
              ...project,
              text: project.name,
              children: {
                project_id: project.id,
                list: (await GroupService.fetchProjectGroups(project)).map(
                  group => {
                    return {
                      ...group,
                      text: group.name,
                      project
                    };
                  }
                )
              }
            };
          })
      );
      open();
    };

    const checkItem = currentItem => {
      const currentProjectId = currentItem.project.id;

      const currentItemIndex = checkedItems.value[currentProjectId].findIndex(
        item => item.id === currentItem.id
      );

      if (currentItemIndex === -1) {
        checkedItems.value[currentProjectId].push(currentItem);
      } else {
        checkedItems.value[currentProjectId].splice(currentItemIndex, 1);
      }

      return currentItemIndex === -1 || currentItemIndex === 0 ? true : false;
    };

    const checkAllItems = children => {
      checkedItems.value[children.project_id] =
        checkedItems.value[children.project_id].length === children.list.length
          ? []
          : Array.from(children.list);
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
      openGroupImport,
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
