<template>
  <div class="project-files">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        v-if="project.isAdmin"
        data-test="btn-manage-groups"
        width="120px"
        color="primary"
        fill
        radius
        @click="goToProjectGroups"
      >
        <BIMDataIcon name="group" size="s" margin="0 6px 0 0" />
        <span>{{ $t("ProjectFiles.groupsButtonText") }}</span>
      </BIMDataButton>
    </app-slot-content>

    <FilesManager
      class="project-files__block--files"
      :project="project"
      :fileStructure="fileStructure"
      :groups="groups"
      @file-uploaded="reloadFileStructure"
      @folder-permission-updated="reloadFileStructure"
      @group-permission-updated="reloadFileStructure"
    />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useFiles } from "@/state/files";
import { useGroups } from "@/state/groups";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { debounce } from "@/utils/async";
// Components
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";
import FilesManager from "@/components/specific/files/files-manager/FilesManager";

export default {
  components: {
    AppSlotContent,
    FilesManager
  },
  setup() {
    const router = useRouter();
    const { currentProject } = useProjects();
    const { loadProjectModels } = useModels();
    const { loadProjectFileStructure, projectFileStructure } = useFiles();
    const { projectGroups } = useGroups();

    const reloadFileStructure = debounce(async () => {
      await loadProjectFileStructure(currentProject.value);
      await loadProjectModels(currentProject.value);
    }, 1000);

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
      groups: projectGroups,
      project: currentProject,
      // Methods
      goToProjectGroups,
      reloadFileStructure
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
