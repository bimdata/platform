<template>
  <div class="project-overview">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        data-test="btn-toggle-upload"
        width="120px"
        :color="showFileUploader ? 'tertiary-darkest' : 'primary'"
        fill
        radius
        @click="toggleFileUploader"
      >
        <BIMDataIcon :name="showFileUploader ? 'close' : 'plus'" size="xxxs" />
        <span>{{
          showFileUploader
            ? $t("ProjectOverview.closeFileUploadButtonText")
            : $t("ProjectOverview.openFileUploadButtonText")
        }}</span>
      </BIMDataButton>
    </app-slot-content>

    <transition name="fade">
      <FileUploader
        v-show="showFileUploader"
        class="project-overview__block--upload"
        :project="project"
        :allowedFileTypes="['.ifc', '.ifczip']"
        @file-uploaded="reloadModels"
        @close="closeFileUploader"
      />
    </transition>
    <ModelsOverview
      class="project-overview__block--overview"
      :project="project"
      :models="models"
      @open-file-uploader="openFileUploader"
    />
    <ProjectUsersManager
      class="project-overview__block--users"
      :project="project"
      :users="users"
      :invitations="invitations"
    />
    <ModelsManager
      class="project-overview__block--models"
      :project="project"
      :models="models"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useModels } from "@/state/models";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import AppSlotContent from "@/components/generic/app-slot-content/AppSlotContent.vue";
import FileUploader from "@/components/specific/files/file-uploader/FileUploader";
import ModelsManager from "@/components/specific/models/models-manager/ModelsManager";
import ModelsOverview from "@/components/specific/models/models-overview/ModelsOverview";
import ProjectUsersManager from "@/components/specific/users/project-users-manager/ProjectUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    AppSlotContent,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    invitations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { loadProjectModels } = useModels();

    let reloadDebounce = null;
    const reloadModels = () => {
      clearTimeout(reloadDebounce);
      reloadDebounce = setTimeout(async () => {
        await loadProjectModels(props.project);
      }, 1000);
    };

    const showFileUploader = ref(false);
    const openFileUploader = () => {
      showFileUploader.value = true;
    };
    const closeFileUploader = () => {
      showFileUploader.value = false;
    };
    const toggleFileUploader = () => {
      showFileUploader.value = !showFileUploader.value;
    };

    return {
      // References
      showFileUploader,
      // Methods
      closeFileUploader,
      openFileUploader,
      reloadModels,
      toggleFileUploader
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectOverview.scss"></style>
