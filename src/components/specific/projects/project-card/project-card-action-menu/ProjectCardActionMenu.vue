<template>
  <div class="project-card-action-menu" v-click-away="resetMenu">
    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="project-card-action-menu__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="showUpdateForm">
        <ProjectCardUpdateForm
          :project="project"
          @close="closeUpdateForm"
          @success="closeMenu"
        />
      </template>

      <template v-else-if="showDeleteGuard">
        <ProjectCardDeleteGuard :project="project" @close="closeDeleteGuard" />
      </template>

      <template v-else>
        <div class="project-card-action-menu__menu">
          <div class="project-card-action-menu__menu__title">
            <TextBox :text="project.name" :maxLength="32" />
            <BIMDataButton
              data-test="btn-close-menu"
              ghost
              rounded
              icon
              @click="closeMenu"
            >
              <BIMDataIcon name="close" size="xxs" />
            </BIMDataButton>
          </div>
          <BIMDataButton
            data-test="btn-open-update"
            ghost
            squared
            @click="openUpdateForm"
          >
            {{ $t("ProjectCardActionMenu.renameButtonText") }}
          </BIMDataButton>
          <BIMDataButton
            data-test="btn-open-delete"
            ghost
            squared
            @click="openDeleteGuard"
          >
            {{ $t("ProjectCardActionMenu.deleteButtonText") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import { useToggle } from "@/composables/toggle";
// Components
import ProjectCardDeleteGuard from "../project-card-delete-guard/ProjectCardDeleteGuard";
import ProjectCardUpdateForm from "../project-card-update-form/ProjectCardUpdateForm";

export default {
  components: {
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

    const {
      isOpen: showUpdateForm,
      open: openUpdateForm,
      close: closeUpdateForm
    } = useToggle();

    const {
      isOpen: showDeleteGuard,
      open: openDeleteGuard,
      close: closeDeleteGuard
    } = useToggle();

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
