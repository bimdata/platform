<template>
  <div class="project-users-manager">
    <img src="/static/project-users-manager-illustration.svg" />
    <div>
      {{ $t("ProjectBoard.ProjectUsersManager.onboardingText") }}
    </div>
    <div class="project-users-manager__actions">
      <BIMDataButton color="primary" fill radius>
        {{ $t("ProjectBoard.ProjectUsersManager.buttonInvite") }}
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

<style scoped lang="scss" src="./ProjectUsersManager.scss"></style>
