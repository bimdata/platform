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
          v-if="project.isAdmin"
          data-guide="btn-manage-groups"
          data-test="btn-manage-groups"
          :width="isLG ? undefined : '120px'"
          color="primary"
          fill
          radius
          :icon="isLG"
        >
          <BIMDataIcon name="group" size="s" />
          <span v-if="!isLG" style="margin-left: 6px">
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
          :groups="groups"
          @file-uploaded="reloadData"
          @file-updated="reloadData"
          @folder-permission-updated="reloadData"
          @group-permission-updated="reloadData"
          @model-created="reloadData"
          @switch-sub-modal="$emit('switch-sub-modal', $event)"
        />
      </AppLoading>
    </div>
  </div>
</template>

<script>
import { useStandardBreakpoints } from "@/composables/responsive.js";
import routeNames from "@/router/route-names.js";
import { useFiles } from "@/state/files.js";
import { useGroups } from "@/state/groups.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { debounce } from "@/utils/async.js";
// Components
import AppLoading from "@/components/specific/app/app-loading/AppLoading.vue";
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import FilesManager from "@/components/specific/files/files-manager/FilesManager.vue";

export default {
  components: {
    AppLink,
    AppLoading,
    AppSlotContent,
    FilesManager
  },
  emits: ["switch-sub-modal"],
  setup() {
    const { currentSpace, spaceSubInfo, loadSpaceSubInfo } = useSpaces();
    const { currentProject } = useProjects();
    const { loadProjectModels } = useModels();
    const { projectFileStructure, loadProjectFileStructure } = useFiles();
    const { projectGroups } = useGroups();

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
      groups: projectGroups,
      project: currentProject,
      routeNames,
      spaceSubInfo,
      // Methods
      reloadData,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFiles.scss"></style>
