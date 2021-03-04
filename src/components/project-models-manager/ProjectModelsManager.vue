<template>
  <div class="project-models-manager">
    <img
      width="260"
      height="260"
      src="/static/project-models-manager-illustration.svg"
    />
    <div>
      {{ $t("ProjectBoard.ProjectModelsManager.onboardingText") }}
    </div>
    <div class="project-models-manager__actions">
      <BIMDataButton color="primary" fill radius>
        {{ $t("ProjectBoard.ProjectModelsManager.buttonUpload") }}
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

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
