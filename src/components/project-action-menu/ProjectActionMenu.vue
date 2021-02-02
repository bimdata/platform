<template>
  <div class="project-action-menu"
    @click.stop="() => {}"
    v-click-away="closeMenu">

    <BIMDataButton color="default" ghost rounded icon
      class="project-action-menu__btn"
      :class="{ clicked }"
      @click="toggleMenu">
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="project-action-menu__container" v-show="showMenu">
        <transition name="fade" mode="out-in">

          <div class="action-loader" v-if="loading">
            <BIMDataSpinner />
          </div>

          <ProjectUpdateForm v-else-if="showUpdateForm"
            :project="project"
            @close="closeUpdateForm"
            @success="closeMenu"
          />

          <ProjectDeleteGuard v-else-if="showDeleteGuard"
            :project="project"
            @close="closeDeleteGuard"
          />

          <div class="action-menu" v-else>
            <BIMDataButton ghost squared
              @click="openUpdateForm">
              {{ $t('Projects.ProjectActionMenu.rename') }}
            </BIMDataButton>
            <BIMDataButton ghost squared
              @click="openDeleteGuard">
              {{ $t('Projects.ProjectActionMenu.delete') }}
            </BIMDataButton>
          </div>

        </transition>
      </div>
    </transition>

  </div>
</template>

<script>
import { provide, ref } from 'vue';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataSpinner from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js';
import ProjectDeleteGuard from '@/components/project-delete-guard/ProjectDeleteGuard';
import ProjectUpdateForm from '@/components/project-update-form/ProjectUpdateForm';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSpinner,
    ProjectDeleteGuard,
    ProjectUpdateForm,
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    const loading = ref(false);
    provide('loading', loading);

    const clicked = ref(false);
    const rippleEffect = () => {
      clicked.value = true;
      setTimeout(() => clicked.value = false, 500);
    };

    const showMenu = ref(false);
    const closeMenu = () => {
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
      showMenu.value = false;
    };
    const toggleMenu = () => {
      rippleEffect();
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
      showMenu.value = !showMenu.value;
    };

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

    return {
      // References
      clicked,
      loading,
      showDeleteGuard,
      showMenu,
      showUpdateForm,
      // Methods
      closeMenu,
      closeDeleteGuard,
      closeUpdateForm,
      openDeleteGuard,
      openUpdateForm,
      toggleMenu,
    };
  }
}
</script>

<style scoped lang="scss" src="./ProjectActionMenu.scss"></style>
