<template>
  <div class="project-files">
    <AppSlotContent name="project-board-action">
      <AppLink
        :to="{
          name: routeNames.projectGroups,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id
          }
        }"
      >
        <BIMDataButton
          v-if="isProjectAdmin(project)"
          data-test-id="btn-manage-groups"
          data-guide="btn-manage-groups"
          :width="isXXL ? undefined : '120px'"
          color="primary"
          fill
          radius
          :icon="isXXL"
        >
          <BIMDataIconGroup size="s" />
          <span v-if="!isXXL" style="margin-left: 6px">
            {{ $t("ProjectFiles.groupsButtonText") }}
          </span>
        </BIMDataButton>
      </AppLink>
    </AppSlotContent>

    <div class="project-files__content">
      <AppLoading name="project-files">
        <FilesManager
          :spaceSubInfo="spaceSubInfo"
          :project="project"
          :fileStructure="fileStructure"
          @file-uploaded="reloadData"
          @file-updated="reloadData"
          @model-created="reloadData"
        />
      </AppLoading>
    </div>
  </div>
</template>

<script>
import { useStandardBreakpoints } from "../../../composables/responsive.js";
import routeNames from "../../../router/route-names.js";
import { useFiles } from "../../../state/files.js";
import { useModels } from "../../../state/models.js";
import { useProjects } from "../../../state/projects.js";
import { useSpaces } from "../../../state/spaces.js";
import { useUser } from "../../../state/user.js";
import { debounce } from "../../../utils/async.js";
// Components
import AppLink from "../../../components/specific/app/app-link/AppLink.vue";
import AppLoading from "../../../components/specific/app/app-loading/AppLoading.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.js";
import FilesManager from "../../../components/specific/files/files-manager/FilesManager.vue";

export default {
  components: {
    AppLink,
    AppLoading,
    AppSlotContent,
    FilesManager
  },
  setup() {
    const { isProjectAdmin } = useUser();
    const { currentSpace, spaceSubInfo, loadSpaceSubInfo } = useSpaces();
    const { currentProject } = useProjects();
    const { loadProjectModels } = useModels();
    const { projectFileStructure, loadProjectFileStructure } = useFiles();

    const reloadData = debounce(async () => {
      await Promise.all([
        loadSpaceSubInfo(currentSpace.value),
        loadProjectFileStructure(currentProject.value),
        loadProjectModels(currentProject.value)
      ]);
    }, 1000);

    return {
      // References
      fileStructure: projectFileStructure,
      project: currentProject,
      routeNames,
      spaceSubInfo,
      // Methods
      isProjectAdmin,
      reloadData,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
