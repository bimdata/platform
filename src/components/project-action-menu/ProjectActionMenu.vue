<template>
  <div class="project-action-menu" v-click-away="resetMenu">
    <transition name="fade" mode="out-in">
      <div class="action-loader" v-if="loading">
        <BIMDataSpinner />
      </div>

      <ProjectUpdateForm
        v-else-if="showUpdateForm"
        :project="project"
        @close="closeUpdateForm"
        @success="closeMenu"
      />

      <ProjectDeleteGuard
        v-else-if="showDeleteGuard"
        :project="project"
        @close="closeDeleteGuard"
      />

      <div class="action-menu" v-else>
        <div class="action-menu__title">
          {{ project.name }}
          <BIMDataButton ghost rounded icon @click="closeMenu">
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
        <BIMDataButton ghost squared @click="openUpdateForm">
          {{ $t("Projects.ProjectActionMenu.rename") }}
        </BIMDataButton>
        <BIMDataButton ghost squared @click="openDeleteGuard">
          {{ $t("Projects.ProjectActionMenu.delete") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import ProjectDeleteGuard from "@/components/project-delete-guard/ProjectDeleteGuard";
import ProjectUpdateForm from "@/components/project-update-form/ProjectUpdateForm";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSpinner,
    ProjectDeleteGuard,
    ProjectUpdateForm
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close-menu"],
  setup(props, { emit }) {
    const loading = ref(false);
    provide("loading", loading);

    const showUpdateForm = ref(false);
    const openUpdateForm = () => {
      showUpdateForm.value = true;
    };
    const closeUpdateForm = () => {
      showUpdateForm.value = false;
    };

    const showDeleteGuard = ref(false);
    const openDeleteGuard = () => {
      showDeleteGuard.value = true;
    };
    const closeDeleteGuard = () => {
      showDeleteGuard.value = false;
    };

    const resetMenu = () => {
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
    };

    const closeMenu = () => {
      resetMenu();
      emit("close-menu");
    };

    return {
      // References
      loading,
      showDeleteGuard,
      showUpdateForm,
      // Methods
      closeMenu,
      closeDeleteGuard,
      closeUpdateForm,
      openDeleteGuard,
      openUpdateForm,
      resetMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectActionMenu.scss"></style>
