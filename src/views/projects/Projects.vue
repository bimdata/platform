<template>
  <div class="projects-view">
    
    <BIMDataSpinner class="loader" v-if="loading" />

    <template v-else>

      <div class="sub-header">
        <GoBackButton />
        <!-- TODO -->
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
import { onMounted, ref } from 'vue';
import { useProjectsState } from '@/state/projectsState';
import { useSpacesState } from '@/state/spacesState';
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
    const { currentSpace } = useSpacesState();
    const { projects, fetchProjects } = useProjectsState();

    const loading = ref(false);

    onMounted(() => {
      loading.value = true;
      fetchProjects(currentSpace).then(
        () => loading.value = false
      );
    });

    return {
      // References
      loading,
      projects,
    };
  }
}
</script>

<style scoped lang="scss" src="./Projects.scss"></style>
