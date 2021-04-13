<template>
  <FlipableCard
    class="project-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <BIMDataCard @click="goToProjectBoard">
        <template #left>
          <ProjectCardActionBar
            v-if="actionMenu"
            :project="project"
            @open-menu="openMenu"
          />
        </template>
        <template #content>
          <div class="left-stripe"></div>
          <div class="status-badge">Status</div>
          <ProjectCardModelPreview :project="project" />
        </template>
        <template #footer>
          <TextBox :text="project.name" :maxLength="30" />
        </template>
      </BIMDataCard>
    </template>

    <template #back-face>
      <ProjectCardActionMenu :project="project" @close="closeMenu" />
    </template>
  </FlipableCard>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import FlipableCard from "@/components/generic/flipable-card/FlipableCard";
import TextBox from "@/components/generic/text-box/TextBox";
import ProjectCardActionBar from "@/components/specific/projects/project-card-action-bar/ProjectCardActionBar";
import ProjectCardActionMenu from "@/components/specific/projects/project-card-action-menu/ProjectCardActionMenu";
import ProjectCardModelPreview from "@/components/specific/projects/project-card-model-preview/ProjectCardModelPreview";

export default {
  components: {
    BIMDataCard,
    FlipableCard,
    TextBox,
    ProjectCardActionBar,
    ProjectCardActionMenu,
    ProjectCardModelPreview
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
