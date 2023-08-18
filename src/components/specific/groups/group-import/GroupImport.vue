<template>
  <div class="group-import" v-click-away="close">
    <BIMDataButton
      class="group-import__button"
      fill
      radius
      icon
      @click="openGroupImport"
    >
      <BIMDataIconGroup size="xs" margin="0 6px 0 0" />
      <span>{{ $t("GroupImport.title") }}</span>
      <BIMDataIconChevron
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
      >
        <template #item="{ item }">
          <div
            class="flex items-center justify-between"
            :class="{ warning: isWarning(item) }"
            style="width: 100%"
          >
            <BIMDataTextbox width="70%" :text="item.text" :tooltip="false" />
            <div class="flex items-center">
              <template v-if="isWarning(item)">
                <BIMDataIconWarning
                  class="group-import__menu__warning"
                  color="high"
                  size="xxs"
                  fill
                />
              </template>
              <BIMDataIconChevron size="xxs" margin="0 0 0 6px" />
            </div>
          </div>
        </template>

        <template #children="{ item }">
          <div v-if="isWarning(item)" class="group-import__children__no-child">
            <div class="group-import__children__no-child__content">
              <BIMDataIconWarning color="high" size="xs" fill />
              {{ item.children[0].text }}
            </div>
          </div>
          <div v-else class="submenu p-y-6">
            <div
              class="group-import__children__menu__header"
              @click.stop="checkAllItems(item)"
            >
              <div
                class="group-import__children__menu__header__content p-y-6 p-x-12"
              >
                <BIMDataCheckbox
                  class="group-import__children__menu__header__content--checkbox"
                  margin="0 6px 0 0"
                  :modelValue="groups[item.id].length === item.children.length"
                />
                <span>{{ $t("GroupImport.selectAll") }}</span>
              </div>
              <div class="group-import__children__menu__header__divider" />
            </div>
            <ul class="bimdata-list">
              <li
                v-for="child in item.children"
                :key="child.id"
                class="submenu__item flex items-center p-x-12"
                @click="checkItem(child, item)"
              >
                <BIMDataCheckbox
                  class="group-import__children__menu__item--checkbox"
                  margin="0 6px 0 0"
                  :modelValue="
                    Boolean(groups[item.id]?.some(item => item.id === child.id))
                  "
                />
                <BIMDataTextbox
                  width="70%"
                  :text="child.text"
                  :tooltip="false"
                />
              </li>
            </ul>
            <BIMDataButton
              class="group-import__children__menu--footer"
              :disabled="groups[item.id].length === 0"
              color="primary"
              fill
              radius
              width="95%"
              @click.stop="uploadGroup(item)"
            >
              <span>{{ $t("t.add") }}</span>
            </BIMDataButton>
          </div>
        </template>
      </BIMDataMenu>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
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
    const { t } = useI18n();

    const openGroupImport = async () => {
      if (isOpen.value) return close();

      const mappedProjects = await Promise.all(
        spaceProjects.value
          .filter(({ id }) => id !== props.project.id)
          .map(async project => {
            groups.value[project.id] = [];

            let children = [];

            if (project.isAdmin) {
              const projectGroups = (
                await GroupService.fetchProjectGroups(project)
              ).map(group => {
                const currentGroup = {
                  ...group,
                  text: group.name,
                  project
                };
                return currentGroup;
              });

              children.push(...projectGroups) ||
                children.push({
                  text: t(
                    `GroupImport.${project.isAdmin ? "noGroup" : "notAdmin"}`
                  )
                });
            }

            return {
              ...project,
              key: project.id,
              text: project.name,
              children
            };
          })
      );

      projectsToDisplay.value = mappedProjects.sort(project =>
        project.isAdmin && project.children[0].project ? -1 : 1
      );

      open();
    };

    const uploadGroup = async item => {
      await importGroup(
        props.project,
        groups.value[item.id].map(({ id }) => id)
      );
      groups.value[item.id] = [];
      close();
    };

    const checkItem = (child, item) => {
      const childIndex = groups.value[item.id].findIndex(
        item => item.id === child.id
      );

      if (childIndex === -1) {
        groups.value[item.id].push(child);
      } else {
        groups.value[item.id].splice(childIndex, 1);
      }
    };

    const checkAllItems = item => {
      groups.value[item.id] =
        groups.value[item.id].length === item.children.length
          ? []
          : Array.from(item.children);
    };

    const isWarning = project =>
      !project.isAdmin || !project.children.some(child => child.project);

    return {
      // References
      groups,
      projectsToDisplay,
      // methods
      close,
      isOpen,
      isWarning,
      uploadGroup,
      checkItem,
      checkAllItems,
      openGroupImport
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupImport.scss"></style>
