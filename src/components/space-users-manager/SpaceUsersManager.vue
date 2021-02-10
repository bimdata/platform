<template>
  <div class="space-users-manager">
    <div class="space-users-manager__title">
      {{ $t("Projects.SpaceUsersManager.title") }}
      <BIMDataButton ghost rounded icon>
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="space-users-manager__content">
      <!-- tabs -->
      <!-- search -->
      <!-- user list -->
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
