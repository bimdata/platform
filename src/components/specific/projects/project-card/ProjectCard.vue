<template>
  <FlippableCard
    data-test="project-card"
    class="project-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <BIMDataCard @click="goToProjectBoard">
        <template #content>
          <ProjectCardActionBar
            v-if="actionMenu"
            class="project-card__action-bar"
            :project="project"
            @open-viewer="goToModelViewer"
            @open-menu="openMenu"
          />
          <div class="project-card__left-stripe"></div>
          <div class="project-card__status-badge">Active</div>
          <ProjectCardModelPreview
            :previews="previews"
            @preview-changed="onPreviewChange"
          />
        </template>
        <template #footer>
          <TextBox :text="project.name" :maxLength="30" />
        </template>
      </BIMDataCard>
    </template>

    <template #back-face>
      <ProjectCardActionMenu :project="project" @close="closeMenu" />
    </template>
  </FlippableCard>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import FlippableCard from "@/components/generic/flippable-card/FlippableCard";
import TextBox from "@/components/generic/text-box/TextBox";
import ProjectCardActionBar from "./project-card-action-bar/ProjectCardActionBar";
import ProjectCardActionMenu from "./project-card-action-menu/ProjectCardActionMenu";
import ProjectCardModelPreview from "./project-card-model-preview/ProjectCardModelPreview";

export default {
  components: {
    BIMDataCard,
    FlippableCard,
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
    const { loadProjectModelPreviews } = useProjects();

    const showMenu = ref(false);
    const openMenu = () => (showMenu.value = true);
    const closeMenu = () => (showMenu.value = false);

    const previews = ref([]);
    const currentPreview = ref();
    watch(
      () => props.project,
      async () => {
        previews.value = await loadProjectModelPreviews(props.project);
        currentPreview.value = previews.value[0];
      },
      { immediate: true }
    );

    const onPreviewChange = preview => {
      currentPreview.value = preview;
    };

    const goToModelViewer = () => {
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: currentPreview.value.id
        }
      });
    };

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
      currentPreview,
      previews,
      showMenu,
      // Methods
      closeMenu,
      goToModelViewer,
      goToProjectBoard,
      onPreviewChange,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
