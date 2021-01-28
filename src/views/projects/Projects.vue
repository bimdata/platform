<template>
  <div class="projects-view">

    <div class="sub-header">
      <div class="sub-header--left">
        <GoBackButton />
      </div>
      <div class="sub-header--center">
        <!-- TODO -->
      </div>
      <div class="sub-header--right">
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

  </div>
</template>

<script>
import { useProjects } from '@/state/projects';
// Components
import GoBackButton from '@/components/go-back-button/GoBackButton';
import ProjectCard from '@/components/project-card/ProjectCard';
import ProjectCreationCard from '@/components/project-creation-card/ProjectCreationCard';

export default {
  components: {
    GoBackButton,
    ProjectCard,
    ProjectCreationCard,
  },
  setup() {
    const { projects } = useProjects();

    return {
      // References
      projects,
    };
  }
}
</script>

<style scoped lang="scss" src="./Projects.scss"></style>
