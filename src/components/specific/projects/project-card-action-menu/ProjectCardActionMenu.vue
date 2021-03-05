<template>
  <div class="project-card-action-menu" v-click-away="resetMenu">
    <transition name="fade" mode="out-in">
      <div class="project-card-action-menu__loader" v-if="loading">
        <BIMDataSpinner />
      </div>

      <ProjectCardUpdateForm
        v-else-if="showUpdateForm"
        :project="project"
        @close="closeUpdateForm"
        @success="closeMenu"
      />

      <ProjectCardDeleteGuard
        v-else-if="showDeleteGuard"
        :project="project"
        @close="closeDeleteGuard"
      />

      <div class="project-card-action-menu__menu" v-else>
        <div class="project-card-action-menu__menu__title">
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
import ProjectCardDeleteGuard from "@/components/specific/projects/project-card-delete-guard/ProjectCardDeleteGuard";
import ProjectCardUpdateForm from "@/components/specific/projects/project-card-update-form/ProjectCardUpdateForm";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSpinner,
    ProjectCardDeleteGuard,
    ProjectCardUpdateForm
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
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
      emit("close");
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

<style scoped lang="scss" src="./ProjectCardActionMenu.scss"></style>
