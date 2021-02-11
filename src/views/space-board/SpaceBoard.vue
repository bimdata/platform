<template>
  <div class="space-board-view">
    <div class="sub-header">
      <div class="sub-header--left">
        <Breadcrumb />
      </div>
      <div class="sub-header--center">
        <BIMDataSearch
          width="300px"
          :placeholder="$t('Projects.searchProjects')"
          v-model="searchText"
          clear
        />
      </div>
      <div class="sub-header--right">
        <BIMDataButton fill squared icon>
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton>
        <BIMDataButton fill squared icon @click="sortProjects">
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton fill squared icon @click="openUsersManager">
          <BIMDataIcon name="addUser" size="s" />
        </BIMDataButton>
      </div>
    </div>

    <transition name="fade">
      <div class="side-panel" v-show="showUsersManager">
        <SpaceUsersManager @close="closeUsersManager" />
      </div>
    </transition>

    <transition name="fade" appear>
      <div class="main-container">
        <ProjectCreationCard />
        <transition-group name="card-list">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ProjectCard from "@/components/project-card/ProjectCard";
import ProjectCreationCard from "@/components/project-creation-card/ProjectCreationCard";
import SpaceUsersManager from "@/components/space-users-manager/SpaceUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    Breadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager
  },
  setup() {
    const { currentSpace } = useSpaces();
    const { projects } = useProjects();

    const displayedProjects = ref([]);
    watchEffect(() => (displayedProjects.value = projects.value));

    const searchText = ref("");
    const filterProjects = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedProjects.value = projects.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedProjects.value = projects.value;
      }
    };
    watchEffect(() => filterProjects(searchText.value));

    let sortOrder = "none";
    const sortProjects = () => {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
      const n = sortOrder === "desc" ? -1 : 1;
      displayedProjects.value = displayedProjects.value
        .slice()
        .sort((a, b) => (a.name < b.name ? -1 : 1) * n);
    };

    const showUsersManager = ref(false);
    const openUsersManager = () => {
      showUsersManager.value = true;
    };
    const closeUsersManager = () => {
      showUsersManager.value = false;
    };

    return {
      // References
      projects: displayedProjects,
      searchText,
      showUsersManager,
      space: currentSpace,
      // Methods
      closeUsersManager,
      filterProjects,
      openUsersManager,
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
