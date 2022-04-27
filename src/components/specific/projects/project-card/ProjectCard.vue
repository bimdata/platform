<template>
  <FlippableCard
    :data-test="`project-card project-card-${project.id}`"
    class="project-card"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <AppLink
        data-guide="dashboard-project"
        :data-guide-click="
          project.isAdmin && displayedModels.length > 0
            ? 'dashboard-project'
            : ''
        "
        :to="{
          name: routeNames.projectBoard,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id
          }
        }"
      >
        <BIMDataCard>
          <template #content>
            <ProjectCardActionBar
              class="project-card__action-bar"
              :actionMenu="actionMenu"
              :viewerButton="viewerButton"
              :project="project"
              :models="displayedModels"
              @open-viewer="goToModelViewer"
              @open-menu="openMenu"
            />
            <div
              class="project-card__left-stripe"
              :class="`project-card__left-stripe--${project.projectStatus}`"
            ></div>
            <ProjectStatusBadge :status="project.projectStatus" />
            <ProjectCardModelPreview
              :models="displayedModels"
              @preview-changed="onPreviewChange"
            />
          </template>
          <template #footer>
            <div class="project-card__title">
              <BIMDataTextbox :text="project.name" />
            </div>
          </template>
        </BIMDataCard>
      </AppLink>
    </template>

    <template #back-face>
      <ProjectCardActionMenu :project="project" @close="closeMenu" />
    </template>
  </FlippableCard>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useToggle } from "@/composables/toggle.js";
import { MODEL_TYPE } from "@/config/models.js";
import routeNames from "@/router/route-names.js";
import { useModels } from "@/state/models.js";
// Components
import FlippableCard from "@/components/generic/flippable-card/FlippableCard.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import ProjectStatusBadge from "@/components/specific/projects/project-status-badge/ProjectStatusBadge.vue";
import ProjectCardActionBar from "./project-card-action-bar/ProjectCardActionBar.vue";
import ProjectCardActionMenu from "./project-card-action-menu/ProjectCardActionMenu.vue";
import ProjectCardModelPreview from "./project-card-model-preview/ProjectCardModelPreview.vue";

export default {
  components: {
    AppLink,
    FlippableCard,
    ProjectCardActionBar,
    ProjectCardActionMenu,
    ProjectCardModelPreview,
    ProjectStatusBadge
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    },
    viewerButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter();
    const { loadProjectModels } = useModels();

    const { isOpen: showMenu, open: openMenu, close: closeMenu } = useToggle();

    const currentModel = ref(null);
    const models = ref([]);
    const displayedModels = computed(() => {
      // Only show non archived IFC previews
      return models.value.filter(
        model => model.type === MODEL_TYPE.IFC && !model.archived
      );
    });

    watch(
      () => props.project,
      async () => {
        models.value = await loadProjectModels(props.project);
      },
      { immediate: true }
    );

    watch(displayedModels, () => {
      currentModel.value = displayedModels.value[0];
    });

    const onPreviewChange = model => {
      currentModel.value = model;
    };

    const goToModelViewer = () => {
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: currentModel.value.id
        }
      });
    };

    return {
      // References
      currentModel,
      displayedModels,
      routeNames,
      showMenu,
      // Methods
      closeMenu,
      goToModelViewer,
      onPreviewChange,
      openMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
