<template>
  <div class="group-import" v-click-away="close">
    <BIMDataButton
      class="group-import__button"
      fill
      radius
      icon
      @click="openGroupImport"
    >
      <BIMDataIcon name="group" size="xs" margin="0 6px 0 0" />
      <span>{{ $t("GroupImport.title") }}</span>
      <BIMDataIcon
        name="chevron"
        size="xxs"
        margin="0 0 0 auto"
        :rotate="isOpen ? 90 : 0"
      />
    </BIMDataButton>
    <template v-if="isOpen">
      <BIMDataMenu
        class="group-import__menu"
        childrenLeft
        :menuItems="projectsToDisplay"
      >
        <template #child-header="{ children }">
          <div class="group-import__children-menu__header">
            <div class="group-import__children-menu__header__content">
              <BIMDataCheckbox
                class="group-import__children-menu__header__content--checkbox"
                margin="0 6px 0 0"
                :modelValue="
                  checkedItems[children.project_id].length ===
                  children.list.length
                "
                @update:modelValue="checkAllItems(children)"
              />
              <span>{{ $t("GroupImport.selectAll") }}</span>
            </div>
            <div class="group-import__children-menu__header__divider" />
          </div>
        </template>
        <template #child-item="{ child }">
          <BIMDataCheckbox
            class="group-import__children-menu__item--checkbox"
            margin="0 6px 0 0"
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
        <template #child-footer="{ children }">
          <BIMDataButton
            class="group-import__children-menu--footer"
            color="primary"
            fill
            radius
            width="95%"
            @click="importGroup(children)"
          >
            <span>{{ $t("GroupImport.add") }}</span>
          </BIMDataButton>
        </template>
      </BIMDataMenu>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import { useGroups } from "../../../../state/groups.js";
import { useProjects } from "../../../../state/projects.js";
import { useToggle } from "../../../../composables/toggle.js";
import GroupService from "../../../../services/GroupService.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { spaceProjects } = useProjects();
    const { loadProjectGroups } = useGroups();
    const { isOpen, close, open } = useToggle();

    const projectsToDisplay = ref([]);
    const checkedItems = ref({});

    const openGroupImport = async () => {
      if (isOpen.value) return close();

      projectsToDisplay.value = await Promise.all(
        spaceProjects.value
          .filter(({ isAdmin, id }) => isAdmin && props.project.id !== id)
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

    const importGroup = async children => {
      await GroupService.importGroup(
        props.project,
        checkedItems.value[children.project_id].map(({ id }) => id)
      );

      loadProjectGroups(props.project);
      checkedItems.value[children.project_id] = [];

      close();
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
      checkedItems,
      projectsToDisplay,
      // methods
      close,
      isOpen,
      checkItem,
      importGroup,
      checkAllItems,
      openGroupImport
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupImport.scss"></style>
