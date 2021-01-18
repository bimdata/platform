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
      @click="deleteSpace(space)">
      {{ $t('Spaces.SpaceDeleteGuard.buttonDelete') }}
    </BIMDataButton>
  </div>
</template>

<script>
import { useSpacesState } from '@/state/spacesState';
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
    const { deleteSpace } = useSpacesState();

    const close = () => {
      emit('close');
    };

    return {
      // Methods
      close,
      deleteSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceDeleteGuard.scss"></style>
