<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useUser } from "../../../../state/user.js";
import { wait } from "../../../../utils/async.js";
// Components
import FavoriteProjectCard from "./favorite-project-card/FavoriteProjectCard.vue";
import FavoriteSpaceCard from "./favorite-space-card/FavoriteSpaceCard.vue";

const { t } = useI18n();
const { closeSidePanel } = useAppSidePanel();
const { userSpaces } = useSpaces();
const { userProjects } = useProjects();
const { favorites } = useUser();

const tabs = [
  { id: "spaces", label: t("t.spaces") },
  { id: "projects", label: t("t.projects") }
];
const currentTab = ref(tabs[0].id);
const selectTab = tab => (currentTab.value = tab.id);

const favoriteSpaces = computed(() =>
  favorites.value.cloud_ids
    .map(id => userSpaces.value.find(space => space.id === id))
    .filter(Boolean)
);
const favoriteProjects = computed(() =>
  favorites.value.project_ids
    .map(id => userProjects.value.find(project => project.id === id))
    .filter(Boolean)
);

const list = ref([]);
watch(
  [currentTab, favoriteSpaces, favoriteProjects],
  async ([tab]) => {
    list.value = [];
    await wait(100); // For smoother transitions
    list.value =
      tab === "spaces" ? favoriteSpaces.value : favoriteProjects.value;
  },
  { immediate: true }
);

const { filteredList: displayedList, searchText } = useListFilter(
  list,
  x => x.name
);
</script>

<template>
  <div class="user-favorites-manager">
    <div class="header">
      <span class="icon">&starf;</span>
      <span class="text">{{ $t("UserFavoritesManager.title") }}</span>
      <BIMDataButton ghost rounded icon @click="closeSidePanel">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <BIMDataTabs
      :tabs="tabs"
      width="100%"
      height="40px"
      tabSize="50%"
      :selected="currentTab"
      @tab-click="selectTab"
    />

    <BIMDataSearch
      width="100%"
      :placeholder="$t('t.search')"
      v-model="searchText"
      clear
    />

    <div class="list-container">
      <TransitionGroup name="list">
        <template v-if="currentTab === 'spaces'">
          <FavoriteSpaceCard
            v-for="space of displayedList"
            :key="space.id"
            :space="space"
          />
        </template>
        <template v-else>
          <FavoriteProjectCard
            v-for="project of displayedList"
            :key="project.id"
            :project="project"
          />
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.user-favorites-manager {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 2);
  height: 100%;

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-unit);
    font-weight: bold;

    .icon {
      align-self: baseline;
      font-size: 20px
    }

    .text {
      margin-right: auto;
    }
  }

  .bimdata-search-bar {
    min-height: 32px;
    background-color: var(--color-silver-light);

    &.focus {
      background-color: var(--color-white);
    }
  }

  .list-container {
    display: flex;
    flex-direction: column;
    padding-bottom: calc(var(--spacing-unit) / 2);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
