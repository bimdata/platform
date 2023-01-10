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
        subListMaxHeight="300px"
      >
        <template #item="{ item }">
          <template v-if="isWarning(item)">
            <BIMDataTextbox
              :text="item.text"
              :style="{
                marginLeft: '11px'
              }"
            />
            <BIMDataTooltip
              class="group-import__menu__warning"
              :text="$t(`GroupImport.${item.isAdmin ? 'noGroup' : 'notAdmin'}`)"
              maxWidth="240px"
              position="left"
              color="high"
            >
              <BIMDataIcon
                name="warning"
                margin="3px 6px 0 0"
                color="high"
                size="xxs"
                fill
              />
            </BIMDataTooltip>
          </template>
        </template>

        <template #child-header="{ children }">
          <div
            class="group-import__children-menu__header"
            @click="checkAllItems(children)"
          >
            <div class="group-import__children-menu__header__content">
              <BIMDataCheckbox
                class="group-import__children-menu__header__content--checkbox"
                margin="0 6px 0 0"
                :modelValue="
                  groups[children.project_id].length === children.list.length
                "
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
                groups[child.project.id]?.find(item => item.id === child.id)
              )
            "
          />
          <span>{{ child.text }}</span>
        </template>
        <template #child-footer="{ children }">
          <BIMDataButton
            class="group-import__children-menu--footer"
            :disabled="groups[children.project_id].length === 0"
            color="primary"
            fill
            radius
            width="95%"
            @click="uploadGroup(children)"
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
    const { importGroup } = useGroups();
    const { isOpen, close, open } = useToggle();

    const groups = ref({});
    const projectsToDisplay = ref([]);

    const openGroupImport = async () => {
      if (isOpen.value) return close();

      projectsToDisplay.value = await Promise.all(
        spaceProjects.value
          .filter(({ id }) => id !== props.project.id)
          .map(async project => {
            groups.value[project.id] = [];

            let children = {};
            if (project.isAdmin) {
              children = {
                project_id: project.id,
                list: (await GroupService.fetchProjectGroups(project)).map(
                  group => {
                    const currentGroup = {
                      ...group,
                      text: group.name,
                      project,
                      action: () => checkItem(currentGroup)
                    };
                    return currentGroup;
                  }
                )
              };
            }

            return {
              ...project,
              text: project.name,
              children
            };
          })
      );
      open();
    };

    const uploadGroup = async children => {
      await importGroup(
        props.project,
        groups.value[children.project_id].map(({ id }) => id)
      );
      groups.value[children.project_id] = [];
      close();
    };

    const checkItem = currentItem => {
      const currentProjectId = currentItem.project.id;

      const currentItemIndex = groups.value[currentProjectId].findIndex(
        item => item.id === currentItem.id
      );

      if (currentItemIndex === -1) {
        groups.value[currentProjectId].push(currentItem);
      } else {
        groups.value[currentProjectId].splice(currentItemIndex, 1);
      }
    };

    const checkAllItems = children => {
      groups.value[children.project_id] =
        groups.value[children.project_id].length === children.list.length
          ? []
          : Array.from(children.list);
    };

    const isWarning = project =>
      !project.isAdmin || project.children.list.length === 0;

    return {
      // References
      groups,
      projectsToDisplay,
      // methods
      close,
      isOpen,
      isWarning,
      uploadGroup,
      checkAllItems,
      openGroupImport
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupImport.scss"></style>
