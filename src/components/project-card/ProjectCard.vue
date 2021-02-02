<template>
  <BIMDataCard class="project-card">
    <template #left>
      <ProjectActionBar :project="project" />
    </template>
    <template #content>
      <div class="left-stripe"></div>
      <div class="status-badge">Status</div>
      <ProjectModelPreview />
    </template>
    <template #footer>
      <div>{{ project.name }}</div>
    </template>
  </BIMDataCard>
</template>

<script>
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import ProjectActionBar from "@/components/project-action-bar/ProjectActionBar";
import ProjectModelPreview from "@/components/project-model-preview/ProjectModelPreview";

export default {
  components: {
    BIMDataCard,
    ProjectActionBar,
    ProjectModelPreview
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
