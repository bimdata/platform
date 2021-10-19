<template>
  <FlippableCard
    :data-test="`project-card project-card-${project.id}`"
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
            :models="nonArchivedModels"
            @open-viewer="goToModelViewer"
            @open-menu="openMenu"
          />
          <div class="project-card__left-stripe"></div>
          <div class="project-card__status-badge">
            {{ $t("ProjectStatusBadge.active") }}
          </div>
          <ProjectCardModelPreview
            :models="nonArchivedModels"
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
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useToggle } from "@/composables/toggle";
import { routeNames } from "@/router";
import { useModels } from "@/state/models";

// Components
import FlippableCard from "@/components/generic/flippable-card/FlippableCard";
import ProjectCardActionBar from "./project-card-action-bar/ProjectCardActionBar";
import ProjectCardActionMenu from "./project-card-action-menu/ProjectCardActionMenu";
import ProjectCardModelPreview from "./project-card-model-preview/ProjectCardModelPreview";

export default {
  components: {
    FlippableCard,
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
    const { loadProjectModels } = useModels();

    const { isOpen: showMenu, open: openMenu, close: closeMenu } = useToggle();

    const currentModel = ref();
    const models = ref([]);
    const nonArchivedModels = computed(() => {
      return models.value.filter(model => !model.archived)
    })
    watch(
      () => props.project,
      async () => {
        models.value = await loadProjectModels(props.project);
      },
      { immediate: true }
    );
    watch(
      nonArchivedModels,
      () => {
        currentModel.value = nonArchivedModels.value[0]
      }
    );

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
      currentModel,
      showMenu,
      nonArchivedModels,
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
