<template>
  <div class="project-card-action-menu" v-click-away="resetMenu">
    <div class="project-card-action-menu__loader" v-show="loading">
      <BIMDataSpinner />
    </div>

    <transition name="fade" mode="out-in">
      <template v-if="showUpdateForm">
        <ProjectCardUpdateForm
          :project="project"
          @close="closeUpdateForm"
          @success="closeMenu"
        />
      </template>

      <template v-else-if="showDeleteGuard">
        <ProjectCardDeleteGuard :project="project" @close="closeDeleteGuard" />
      </template>

      <template v-else-if="showLeaveGuard">
        <ProjectCardLeaveGuard :project="project" @close="closeLeaveGuard" />
      </template>

      <template v-else>
        <div class="project-card-action-menu__menu">
          <div class="project-card-action-menu__menu__title">
            <BIMDataTextbox width="220px" :text="project.name" />
            <BIMDataButton
              data-test-id="btn-close-menu"
              ghost
              rounded
              icon
              @click="closeMenu"
            >
              <BIMDataIconClose size="xxs" />
            </BIMDataButton>
          </div>
          <BIMDataButton ghost squared @click="toggleFavorite">
            {{
              $t(
                `SpaceCardActionMenu.${
                  isFavoriteProject(project)
                    ? "removeFavorite"
                    : "addToFavorite"
                }`
              )
            }}
          </BIMDataButton>
          <BIMDataButton
            v-if="isProjectAdmin(project)"
            data-test-id="btn-open-update"
            ghost
            squared
            @click="openUpdateForm"
          >
            {{ $t("t.rename") }}
          </BIMDataButton>
          <BIMDataButton
            v-if="isProjectAdmin(project)"
            data-test-id="btn-open-delete"
            color="high"
            ghost
            squared
            @click="openWarningModal"
          >
            {{ $t("t.delete") }}
          </BIMDataButton>
          <BIMDataButton
            data-test-id="btn-open-leave"
            color="high"
            ghost
            squared
            @click="openLeaveGuard"
          >
            {{ $t("t.leave") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
import { useToggle } from "../../../../../composables/toggle.js";
import { useUser } from "../../../../../state/user.js";
// Components
import WarningModal from "../../../app/warning-modal/WarningModal.vue";
import ProjectCardDeleteGuard from "../project-card-delete-guard/ProjectCardDeleteGuard.vue";
import ProjectCardUpdateForm from "../project-card-update-form/ProjectCardUpdateForm.vue";
import ProjectCardLeaveGuard from "../project-card-leave-guard/ProjectCardLeaveGuard.vue";

export default {
  components: {
    ProjectCardDeleteGuard,
    ProjectCardUpdateForm,
    ProjectCardLeaveGuard
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { isProjectAdmin, isFavoriteProject, addFavoriteProject, removeFavoriteProject } =
      useUser();

    const loading = ref(false);
    provide("loading", loading);

    const toggleFavorite = async () => {
      if (isFavoriteProject(props.project)) {
        await removeFavoriteProject(props.project);
      } else {
        await addFavoriteProject(props.project);
      }
    };

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

    const {
      isOpen: showLeaveGuard,
      open: openLeaveGuard,
      close: closeLeaveGuard
    } = useToggle();

    const resetMenu = () => {
      closeUpdateForm();
      closeDeleteGuard();
      closeLeaveGuard();
      loading.value = false;
    };

    const closeMenu = () => {
      resetMenu();
      emit("close");
    };

    const { openModal } = useAppModal();
    const openWarningModal = () => {
      openModal({ component: WarningModal });
    };

    return {
      // References
      loading,
      showDeleteGuard,
      showUpdateForm,
      showLeaveGuard,
      // Methods
      closeMenu,
      closeDeleteGuard,
      closeUpdateForm,
      closeLeaveGuard,
      isProjectAdmin,
      isFavoriteProject,
      openDeleteGuard,
      openUpdateForm,
      openLeaveGuard,
      openWarningModal,
      resetMenu,
      toggleFavorite
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardActionMenu.scss"></style>
