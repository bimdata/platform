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

    <div class="project-files__block--files">
      <app-loading name="project-files">
        <FilesManager
          :spaceInfo="spaceInfo"
          :project="project"
          :fileStructure="fileStructure"
          :groups="groups"
          @file-uploaded="reloadFileStructure"
          @folder-permission-updated="reloadFileStructure"
          @group-permission-updated="reloadFileStructure"
        />
      </app-loading>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
import { useFiles } from "@/state/files.js";
import { useGroups } from "@/state/groups.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { debounce } from "@/utils/async.js";
// Components
import AppLoading from "@/components/generic/app-loading/AppLoading.vue";
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";
import FilesManager from "@/components/specific/files/files-manager/FilesManager.vue";

export default {
  components: {
    AppLoading,
    AppSlotContent,
    FilesManager
  },
  setup() {
    const router = useRouter();
    const { currentSpace, spaceInfo, loadSpaceInfo } = useSpaces();
    const { currentProject } = useProjects();
    const { loadProjectModels } = useModels();
    const { projectFileStructure, loadProjectFileStructure } = useFiles();
    const { projectGroups } = useGroups();

    const reloadFileStructure = debounce(async () => {
      await Promise.all([
        loadSpaceInfo(currentSpace.value),
        loadProjectFileStructure(currentProject.value),
        loadProjectModels(currentProject.value)
      ]);
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
      spaceInfo,
      // Methods
      goToProjectGroups,
      reloadFileStructure
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
