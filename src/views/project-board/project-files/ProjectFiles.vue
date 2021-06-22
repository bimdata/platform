<template>
  <div class="project-files">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        data-test="btn-toggle-groups"
        width="120px"
        color="primary"
        fill
        radius
        @click="goToProjectGroups"
      >
        <BIMDataIcon name="group" size="s" />
        <span>{{ $t("ProjectFiles.groupsButtonText") }}</span>
      </BIMDataButton>
    </app-slot-content>

    <FilesManager
      class="project-files__block--files"
      :project="project"
      :fileStructure="fileStructure"
      @file-uploaded="reloadFileStructure"
    />
  </div>
</template>

<script>
import { provide } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useFiles } from "@/state/files";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import AppSlotContent from "@/components/generic/app-slot-content/AppSlotContent.vue";
import FilesManager from "@/components/specific/files/files-manager/FilesManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    AppSlotContent,
    FilesManager
  },
  setup() {
    const router = useRouter();
    const { currentProject } = useProjects();
    const { loadProjectModels } = useModels();
    const {
      loadProjectFileStructure,
      projectFileStructure,
      fileStructureHandler
    } = useFiles();

    provide("fileStructureHandler", fileStructureHandler);

    let reloadDebounce = null;
    const reloadFileStructure = () => {
      clearTimeout(reloadDebounce);
      reloadDebounce = setTimeout(async () => {
        await loadProjectFileStructure(currentProject.value);
        await loadProjectModels(currentProject.value);
      }, 1000);
    };

    const goToProjectGroups = () => {
      router.push({
        name: routeNames.projectGroups,
        params: {
          spaceID: currentProject.value.cloud.id,
          projectID: currentProject.value.id
        }
      });
    };

    return {
      // References
      fileStructure: projectFileStructure,
      project: currentProject,
      // Methods
      goToProjectGroups,
      reloadFileStructure
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
