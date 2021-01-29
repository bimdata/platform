<template>
  <div class="project-action-bar">
    <BIMDataButton ghost rounded icon>
      <BIMDataIcon name="show" size="s" />
    </BIMDataButton>
    <ProjectActionMenu :project="project" />
  </div>
</template>

<script>
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import ProjectActionMenu from '@/components/project-action-menu/ProjectActionMenu';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    ProjectActionMenu,
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss" src="./ProjectActionBar.scss"></style>
