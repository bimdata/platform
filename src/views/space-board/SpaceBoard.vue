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
        <BIMDataButton
          v-if="isAdmin"
          fill
          squared
          icon
          @click="openUsersManager"
        >
          <BIMDataIcon name="addUser" size="s" />
        </BIMDataButton>
      </div>
    </div>

    <transition name="fade">
      <SidePanel
        v-show="showUsersManager"
        :title="$t('SpaceUsersManager.title')"
        @close="closeUsersManager"
      >
        <SpaceUsersManager />
      </SidePanel>
    </transition>

    <transition name="fade" appear>
      <div class="list-container">
        <ProjectCreationCard v-if="isAdmin" />
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
import SidePanel from "@/components/side-panel/SidePanel";
import SpaceUsersManager from "@/components/space-users-manager/SpaceUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    Breadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SidePanel,
    SpaceUsersManager
  },
  setup() {
    const { currentSpace } = useSpaces();
    const { spaceProjects } = useProjects();

    const isAdmin = ref(false);
    watchEffect(() => (isAdmin.value = currentSpace.value.isAdmin));

    const displayedProjects = ref([]);
    watchEffect(() => (displayedProjects.value = spaceProjects.value));

    const searchText = ref("");
    const filterProjects = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedProjects.value = spaceProjects.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedProjects.value = spaceProjects.value;
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
      isAdmin,
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
