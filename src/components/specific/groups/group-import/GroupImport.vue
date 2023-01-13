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
        maxHeight="500px"
        @hover="project => (currentProject = project)"
      >
        <template #item="{ item }">
          <template v-if="isWarning(item)">
            <BIMDataTextbox
              width="70%"
              :text="item.text"
              :tooltip="false"
              :style="{
                marginLeft: '11px'
              }"
            />
            <BIMDataIcon
              class="group-import__menu__warning"
              name="warning"
              margin="0 6px 0 0"
              color="high"
              size="xxs"
              fill
            />
          </template>
        </template>
        <template #children-without-child>
          <div
            class="group-import__children__no-child"
            :style="{
              top: currentProject.itemPos.top - 20 + 'px'
            }"
          >
            <div class="group-import__children__no-child__content">
              <BIMDataIcon name="warning" color="high" size="xs" fill />
              {{
                $t(
                  `GroupImport.${
                    currentProject.isAdmin ? "noGroup" : "notAdmin"
                  }`
                )
              }}
            </div>
          </div>
        </template>
        <template #child-header>
          <div
            class="group-import__children__menu__header"
            @click="checkAllItems"
          >
            <div class="group-import__children__menu__header__content">
              <BIMDataCheckbox
                class="group-import__children__menu__header__content--checkbox"
                margin="0 6px 0 0"
                :modelValue="
                  groups[currentProject.id].length ===
                  currentProject.children.list.length
                "
              />
              <span>{{ $t("GroupImport.selectAll") }}</span>
            </div>
            <div class="group-import__children__menu__header__divider" />
          </div>
        </template>
        <template #child-item="{ child }">
          <BIMDataCheckbox
            class="group-import__children__menu__item--checkbox"
            margin="0 6px 0 0"
            :modelValue="
              Boolean(
                groups[currentProject.id]?.find(item => item.id === child.id)
              )
            "
          />
          <BIMDataTextbox
            width="70%"
            :text="child.text"
            :tooltip="false"
            :style="{
              marginLeft: '11px'
            }"
          />
        </template>
        <template #child-footer>
          <BIMDataButton
            class="group-import__children__menu--footer"
            :disabled="groups[currentProject.id].length === 0"
            color="primary"
            fill
            radius
            width="95%"
            @click="uploadGroup"
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

    const currentProject = ref(null);

    const openGroupImport = async () => {
      if (isOpen.value) return close();

      projectsToDisplay.value = (
        await Promise.all(
          spaceProjects.value
            .filter(({ id }) => id !== props.project.id)
            .map(async project => {
              groups.value[project.id] = [];

              let children = {
                list: []
              };
              if (project.isAdmin) {
                children.list.push(
                  ...(await GroupService.fetchProjectGroups(project)).map(
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
                );
              }
              return {
                ...project,
                key: project.id,
                text: project.name,
                children
              };
            })
        )
      ).sort(project =>
        project.isAdmin && project.children.list.length > 0 ? -1 : 1
      );
      open();
    };

    const uploadGroup = async () => {
      await importGroup(
        props.project,
        groups.value[currentProject.value.id].map(({ id }) => id)
      );
      groups.value[currentProject.value.id] = [];
      close();
    };

    const checkItem = currentItem => {
      const currentItemIndex = groups.value[currentProject.value.id].findIndex(
        item => item.id === currentItem.id
      );

      if (currentItemIndex === -1) {
        groups.value[currentProject.value.id].push(currentItem);
      } else {
        groups.value[currentProject.value.id].splice(currentItemIndex, 1);
      }
    };

    const checkAllItems = () => {
      groups.value[currentProject.value.id] =
        groups.value[currentProject.value.id].length ===
        currentProject.value.children.list.length
          ? []
          : Array.from(currentProject.value.children.list);
    };

    const isWarning = project =>
      !project.isAdmin || project.children.list.length === 0;

    return {
      // References
      groups,
      projectsToDisplay,
      currentProject,
      // methods
      close,
      isOpen,
      isWarning,
      uploadGroup,
      checkAllItems,
      openGroupImport,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupImport.scss"></style>
