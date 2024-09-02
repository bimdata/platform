<template>
  <div class="group-import" v-click-away="closeMenu">
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
      <div class="group-import__menu">
        <BIMDataSearch
          v-if="projectsToDisplay.length"
          width="200px"
          radius
          :placeholder="$t('t.search')"
          v-model="searchText"
        />

        <!-- Template if no project in space  -->
        <template v-if="projectsToDisplay.length === 0">
          <div class="group-import__menu--empty p-6 color-granite">
            <span>
              {{ $t("GroupImport.noProject") }}
            </span>
          </div>
        </template>

        <!-- Template if no group when searching  -->
        <template v-else-if="filteredProjectsToDisplay.length === 0">
          <div class="group-import__menu--empty p-6 color-granite">
            <span>
              {{ $t("GroupImport.noResult") }}
            </span>
          </div>
        </template>

        <!-- Groups list -->
        <BIMDataPaginatedList
          :list="filteredProjectsToDisplay"
          :perPage="14"
          :numberDataElements="
            filteredProjectsToDisplay.length > 99 ? false : true
          "
        >
          <template #element="{ element }">
            <div
              class="group-import__menu__children flex items-center justify-between p-x-6"
              :class="{
                warning: isWarning(element),
                'group-import__menu__children--active': isItemActive(element)
              }"
              @click.stop="onElementClick(element)"
              @mouseover="onMouseOver(element)"
              @mouseleave="onMouseLeave"
            >
              <!-- Template if not admin or if no child project -->
              <template v-if="isWarning(element)">
                <BIMDataTooltip
                  v-if="!isProjectAdmin(element)"
                  :text="$t('GroupImport.notAdmin')"
                  maxWidth="176px"
                  color="high"
                  :style="{ width: '100%' }"
                >
                  <BIMDataTextbox
                    width="calc(100% - 12px - 18px)"
                    :text="element.name"
                    :tooltip="false"
                  />
                  <div
                    style="width: 18px"
                    class="flex items-center justify-start m-l-6"
                  >
                    <BIMDataIconWarning
                      class="group-import__menu__warning"
                      color="high"
                      size="xxs"
                      fill
                    />
                  </div>
                </BIMDataTooltip>
                <BIMDataTooltip
                  v-else
                  :text="$t('GroupImport.noGroup')"
                  maxWidth="176px"
                  color="high"
                  :style="{ width: '100%' }"
                >
                  <BIMDataTextbox
                    width="calc(100% - 12px - 18px)"
                    :text="element.name"
                    :tooltip="false"
                  />
                  <div
                    style="width: 18px"
                    class="flex items-center justify-start m-l-6"
                  >
                    <BIMDataIconWarning
                      class="group-import__menu__warning"
                      color="high"
                      size="xxs"
                      fill
                    />
                  </div>
                </BIMDataTooltip>
              </template>

              <!-- Template for list all group in projects -->
              <template v-else>
                <div class="flex items-center" style="width: 100%">
                  <BIMDataTextbox
                    width="calc(100% - 12px - 18px)"
                    :text="element.name"
                    :tooltip="false"
                  />
                  <div
                    style="width: 18px"
                    class="flex items-center justify-end m-l-6"
                  >
                    <BIMDataIconChevron size="xxs" />
                  </div>
                </div>
                <template v-if="element.children.length">
                  <div
                    v-if="isWarning(element)"
                    class="group-import__menu__children__no-child"
                  >
                    <div
                      class="group-import__menu__children__no-child__content"
                    >
                      <BIMDataIconWarning color="high" size="xs" fill />
                      {{ element.children[0].text }}
                    </div>
                  </div>
                  <div v-if="isItemActive(element)" class="submenu p-y-6">
                    <div
                      v-if="element.children.length > 1"
                      class="group-import__menu__children__submenu__header m-b-6"
                      @click.stop="checkAllItems(element)"
                    >
                      <div
                        class="group-import__menu__children__submenu__header__content p-6"
                      >
                        <BIMDataCheckbox
                          class="group-import__menu__children__submenu__header__content--checkbox"
                          margin="0 6px 0 0"
                          :modelValue="
                            groups[element.id].length ===
                            element.children.length
                          "
                        />
                        <span>{{ $t("GroupImport.selectAll") }}</span>
                      </div>
                      <div
                        class="group-import__menu__children__submenu__header__divider"
                      />
                    </div>
                    <ul class="bimdata-list">
                      <li
                        v-for="child in element.children"
                        :key="child.id"
                        class="flex items-center"
                        @click.stop="checkItem(child, element)"
                      >
                        <BIMDataCheckbox
                          class="group-import__menu__children__submenu__item--checkbox"
                          margin="0 6px 0 0"
                          :modelValue="
                            Boolean(
                              groups[element.id]?.some(
                                element => element.id === child.id
                              )
                            )
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
                      class="group-import__menu__children__submenu--footer"
                      :disabled="groups[element.id].length === 0"
                      color="primary"
                      fill
                      radius
                      width="95%"
                      @click.stop="uploadGroup(element)"
                    >
                      <span>{{ $t("t.add") }}</span>
                    </BIMDataButton>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </BIMDataPaginatedList>
      </div>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useToggle } from "../../../../composables/toggle.js";
import GroupService from "../../../../services/GroupService.js";
import { useGroups } from "../../../../state/groups.js";
import { useProjects } from "../../../../state/projects.js";
import { useUser } from "../../../../state/user.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { isProjectAdmin } = useUser();
    const { spaceProjects } = useProjects();
    const { importGroup } = useGroups();
    const { isOpen, close, open } = useToggle();

    const groups = ref({});
    const projectsToDisplay = ref([]);
    const clickedItemKey = ref(null);
    const hoveredItemKey = ref(null);

    const isItemActive = element => {
      return (
        (element.children?.length > 0 &&
          hoveredItemKey.value === element.key &&
          !clickedItemKey.value) ||
        clickedItemKey.value === element.key
      );
    };

    const onMouseOver = element => {
      hoveredItemKey.value = element.key;
    };

    const onMouseLeave = () => {
      hoveredItemKey.value = null;
    };

    const closeMenu = () => {
      clickedItemKey.value = null;
      close();
    };

    const onElementClick = element => {
      if (!element.children || element.key === clickedItemKey.value) {
        clickedItemKey.value = null;
      } else {
        clickedItemKey.value = element.id;
      }
    };

    const { filteredList: filteredProjectsToDisplay, searchText } =
      useListFilter(projectsToDisplay, item => item.name);

    const openGroupImport = async () => {
      if (isOpen.value) return closeMenu();

      const mappedProjects = await Promise.all(
        spaceProjects.value
          .filter(({ id }) => id !== props.project.id)
          .map(async project => {
            groups.value[project.id] = [];

            let children = [];

            if (isProjectAdmin(project)) {
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

              children.push(...projectGroups);
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
        isProjectAdmin(project) &&
        project.children.length &&
        project.children[0].project
          ? -1
          : 1
      );

      open();
    };

    const uploadGroup = async item => {
      await importGroup(
        props.project,
        groups.value[item.id].map(({ id }) => id)
      );
      groups.value[item.id] = [];
      closeMenu();
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
      !isProjectAdmin(project) || !project.children.some(child => child.project);

    return {
      // References
      filteredProjectsToDisplay,
      groups,
      isItemActive,
      isOpen,
      projectsToDisplay,
      searchText,
      // Methods
      checkAllItems,
      checkItem,
      closeMenu,
      isProjectAdmin,
      isWarning,
      onElementClick,
      onMouseLeave,
      onMouseOver,
      openGroupImport,
      uploadGroup,
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupImport.scss"></style>
