<template>
  <div class="space-users-manager">
    <div class="space-users-manager__title">
      {{ $t("Projects.SpaceUsersManager.title") }}
      <BIMDataButton ghost rounded icon>
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="space-users-manager__content">
      <!-- <BIMDataTabs
        :tabs="[ 'Administarteurs', 'Utilisateurs' ]"
        width="100%"
        height="40px"
        tabSize="50%"
      /> -->
      <BIMDataSearch />
      <div>
        <!-- user list -->
      </div>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
// import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch
    // BIMDataTabs
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
