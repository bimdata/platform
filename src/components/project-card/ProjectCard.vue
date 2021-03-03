<template>
  <FlipableCard
    class="project-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <BIMDataCard @click="goToProjectBoard">
        <template #left>
          <ProjectActionBar
            v-if="actionMenu"
            :project="project"
            @open-menu="openMenu"
          />
        </template>
        <template #content>
          <div class="left-stripe"></div>
          <div class="status-badge">Status</div>
          <ProjectModelPreview :project="project" />
        </template>
        <template #footer>
          <div>{{ project.name }}</div>
        </template>
      </BIMDataCard>
    </template>

    <template #back-face>
      <ProjectActionMenu :project="project" @close-menu="closeMenu" />
    </template>
  </FlipableCard>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import FlipableCard from "@/components/flipable-card/FlipableCard";
import ProjectActionBar from "@/components/project-action-bar/ProjectActionBar";
import ProjectModelPreview from "@/components/project-model-preview/ProjectModelPreview";
import ProjectActionMenu from "@/components/project-action-menu/ProjectActionMenu";

export default {
  components: {
    BIMDataCard,
    ProjectActionBar,
    ProjectModelPreview,
    ProjectActionMenu,
    FlipableCard
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter();

    const showMenu = ref(false);
    const openMenu = () => (showMenu.value = true);
    const closeMenu = () => (showMenu.value = false);

    const goToProjectBoard = () => {
      router.push({
        name: routeNames.projectBoard,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id
        }
      });
    };

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      goToProjectBoard,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
