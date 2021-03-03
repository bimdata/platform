<template>
  <div class="project-board-view">
    <div class="sub-header">
      <div class="sub-header--left">
        <Breadcrumb />
      </div>
      <div class="sub-header--center">
        <BIMDataTabs
          width="200px"
          height="32px"
          tabSize="50%"
          selected="project"
          :tabs="[
            { id: 'project', label: 'Projet' },
            { id: 'bcf', label: 'BCF' }
          ]"
        />
      </div>
      <div class="sub-header--right">
        <BIMDataButton color="primary" fill radius>
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t("ProjectBoard.addIFC") }}</span>
        </BIMDataButton>
      </div>
    </div>

    <div class="container">
      <div class="block block--models">
        <div class="block__title">
          {{ $t("ProjectBoard.ProjectModelsManager.title") }}
        </div>
        <div class="block__content">
          <ProjectModelsManager :project="project" />
        </div>
      </div>
      <div class="block block--users">
        <div class="block__title">
          {{ $t("ProjectBoard.ProjectUsersManager.title") }}
        </div>
        <div class="block__content">
          <ProjectUsersManager :project="project" />
        </div>
      </div>
      <div class="block block--files">
        <div class="block__title">
          {{ $t("ProjectBoard.ProjectFilesManager.title") }}
        </div>
        <div class="block__content">
          <ProjectFilesManager :project="project" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ProjectFilesManager from "@/components/project-files-manager/ProjectFilesManager";
import ProjectModelsManager from "@/components/project-models-manager/ProjectModelsManager";
import ProjectUsersManager from "@/components/project-users-manager/ProjectUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataTabs,
    Breadcrumb,
    ProjectFilesManager,
    ProjectModelsManager,
    ProjectUsersManager
  },
  setup() {
    const { currentProject } = useProjects();

    return {
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
