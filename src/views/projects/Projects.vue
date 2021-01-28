<template>
  <div class="projects-view">
    
    <BIMDataSpinner class="loader" v-if="loading" />

    <template v-else>

      <div class="sub-header">
        <div class="sub-header--left">
          <GoBackButton />
        </div>
        <div class="sub-header--center">
          <!-- TODO -->
        </div>
        <div class="sub-header-right">
          <!-- TODO -->
        </div>
      </div>

      <transition name="fade" appear>
        <div class="projects-list">
          <ProjectCreationCard />
          <transition-group name="card-list">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
          </transition-group>
        </div>
      </transition>

    </template>

  </div>
</template>

<script>
import { ref } from 'vue';
import { useProjectsState } from '@/state/projectsState';
// Components
import BIMDataSpinner from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js';
import GoBackButton from '@/components/go-back-button/GoBackButton';
import ProjectCard from '@/components/project-card/ProjectCard';
import ProjectCreationCard from '@/components/project-creation-card/ProjectCreationCard';

export default {
  components: {
    BIMDataSpinner,
    GoBackButton,
    ProjectCard,
    ProjectCreationCard,
  },
  setup() {
    const { projects } = useProjectsState();

    const loading = ref(false);

    return {
      // References
      loading,
      projects,
    };
  }
}
</script>

<style scoped lang="scss" src="./Projects.scss"></style>
