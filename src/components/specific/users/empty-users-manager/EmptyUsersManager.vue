<template>
  <div class="empty-users-manager">
    <img
      width="260"
      height="260"
      src="/static/empty-users-manager-illustration.svg"
    />
    <div>
      {{ $t("ProjectBoard.ProjectUsersManager.onboardingText") }}
    </div>
    <div class="empty-users-manager__actions">
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

<style scoped lang="scss" src="./EmptyUsersManager.scss"></style>
