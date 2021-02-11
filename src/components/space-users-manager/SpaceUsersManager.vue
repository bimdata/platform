<template>
  <div class="space-users-manager">
    <div class="space-users-manager__title">
      {{ $t("Projects.SpaceUsersManager.title") }}
      <BIMDataButton ghost rounded icon @click="close">
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
        <div v-for="user in users" :key="user.id">
          {{ `${user.firstname} ${user.lastname} (${user.email})` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useSpaces } from "@/state/spaces";
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
  emits: ["close"],
  setup(props, { emit }) {
    const { currentSpace, currentSpaceAdmins, currentSpaceUsers } = useSpaces();

    // const users = ref([]);
    // users.value = currentSpaceAdmins.value;

    const close = () => emit("close");

    return {
      // Refrences,
      space: currentSpace,
      users: currentSpaceAdmins,
      // Methods
      close
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceUsersManager.scss"></style>
