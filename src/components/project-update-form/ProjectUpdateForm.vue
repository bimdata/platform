<template>
  <div class="project-update-form">
    <div class="project-update-form__title">
      {{ $t('Projects.ProjectUpdateForm.title') }}
    </div>
    <BIMDataButton ghost rounded icon
      class="project-update-form__close-btn"
      @click="close">
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
    <BIMDataInput ref="nameInput"
      class="project-update-form__input"
      :placeholder="$t('Projects.ProjectUpdateForm.inputName')"
      v-model="projectName"
    />
    <BIMDataButton fill radius color="primary"
      class="project-update-form__submit-btn"
      @click="renameProject">
      {{ $t('Projects.ProjectUpdateForm.buttonRename') }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import { useProjects } from '@/state/projects';
import { useSpaces } from '@/state/spaces';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataInput from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: [
    'close',
    'success',
    'error',
  ],
  setup(props, { emit }) {
    const { currentSpace } = useSpaces();
    const { updateProject } = useProjects();

    const loading = inject('loading', false);

    const nameInput = ref(null);
    const projectName = ref(props.project.name);
    const renameProject = () => {
      loading.value = true;
      updateProject(currentSpace.value, { ...props.project, name: projectName.value })
        .then(() => emit('success'))
        .catch((error) => emit('error', error));
    };

    const close = () => {
      emit('close');
    };

    onMounted(
      () => setTimeout(() => nameInput.value.focus(), 400)
    );

    return {
      // References
      nameInput,
      projectName,
      // Methods
      close,
      renameProject,
    };
  }
}
</script>

<style scoped lang="scss" src="./ProjectUpdateForm.scss"></style>
