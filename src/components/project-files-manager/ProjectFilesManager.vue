<template>
  <div class="project-files-manager">
    <img
      width="260"
      height="260"
      src="/static/project-files-manager-illustration.svg"
    />
    <div>
      {{ $t("ProjectBoard.ProjectFilesManager.onboardingText") }}
    </div>
    <div class="project-files-manager__actions">
      <BIMDataButton color="primary" fill radius>
        {{ $t("ProjectBoard.ProjectFilesManager.buttonUploadFile") }}
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius>
        {{ $t("ProjectBoard.ProjectFilesManager.buttonCreateFolder") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./ProjectFilesManager.scss"></style>
