<template>
  <div class="project-delete-guard">
    <div class="project-delete-guard__title">
      {{ $t('Projects.ProjectDeleteGuard.title') }}
    </div>
    <BIMDataButton ghost rounded icon
      class="project-delete-guard__close-btn"
      @click="close">
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
    <div class="project-delete-guard__message">
      {{ $t('Projects.ProjectDeleteGuard.message') }}
    </div>
    <BIMDataButton fill radius color="high"
      class="project-delete-guard__submit-btn"
      @click="removeProject">
      {{ $t('Projects.ProjectDeleteGuard.buttonDelete') }}
    </BIMDataButton>
  </div>
</template>

<script>
import { useProjects } from '@/state/projects';
import { useSpaces } from '@/state/spaces';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import { inject } from 'vue';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: [
    'close'
  ],
  setup(props, { emit }) {
    const { currentSpace } = useSpaces();
    const { deleteProject } = useProjects();

    const loading = inject('loading', false);

    const removeProject = () => {
      loading.value = true;
      deleteProject(currentSpace.value, { ...props.project });
    };

    const close = () => {
      emit('close');
    };

    return {
      // Methods
      close,
      removeProject
    };
  }
}
</script>

<style scoped lang="scss" src="./ProjectDeleteGuard.scss"></style>
