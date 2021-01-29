<template>
  <div class="space-delete-guard">
    <div class="space-delete-guard__title">
      {{ $t('Spaces.SpaceDeleteGuard.title') }}
    </div>
    <BIMDataButton ghost rounded icon
      class="space-delete-guard__close-btn"
      @click="close">
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
    <div class="space-delete-guard__message">
      {{ $t('Spaces.SpaceDeleteGuard.message') }}
    </div>
    <BIMDataButton fill radius color="high"
      class="space-delete-guard__submit-btn"
      @click="removeSpace">
      {{ $t('Spaces.SpaceDeleteGuard.buttonDelete') }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from 'vue';
import { useSpaces } from '@/state/spaces';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: [
    'close'
  ],
  setup(props, { emit }) {
    const { deleteSpace } = useSpaces();

    const loading = inject('loading', false);

    const removeSpace = () => {
      loading.value = true;
      deleteSpace({ ...props.space });
    };

    const close = () => {
      emit('close');
    };

    return {
      // Methods
      close,
      removeSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceDeleteGuard.scss"></style>
