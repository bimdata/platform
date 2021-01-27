<template>
  <BIMDataCard class="project-card">
    <!-- TODO -->
    <template #content>
      Project ID: {{ project.id }}<br/>
      Project Name: {{ project.name }}
    </template>
  </BIMDataCard>
</template>

<script>
import BIMDataCard from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js';

export default {
  components: {
    BIMDataCard,
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
