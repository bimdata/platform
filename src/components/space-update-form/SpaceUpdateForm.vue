<template>
  <div class="space-update-form">
    <div class="space-update-form__title">
      {{ $t('Spaces.SpaceRenameForm.title') }}
    </div>
    <BIMDataButton ghost rounded icon
      class="space-update-form__close-btn"
      @click="close">
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
    <BIMDataInput ref="nameInput"
      class="space-update-form__input"
      :placeholder="$t('Spaces.SpaceRenameForm.inputName')"
      v-model="spaceName"
    />
    <BIMDataButton fill radius color="primary"
      class="space-update-form__submit-btn"
      @click="renameSpace">
      {{ $t('Spaces.SpaceRenameForm.buttonRename') }}
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useSpacesState } from '@/state/spacesState';
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
    space: {
      type: Object,
      required: true
    }
  },
  emits: [
    'close'
  ],
  setup(props, { emit }) {
    const { updateSpace } = useSpacesState();

    const nameInput = ref(null);
    const spaceName = ref(props.space.name);
    const renameSpace = () => {
      updateSpace({ ...props.space, name: spaceName.value }).then(close);
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
      spaceName,
      // Methods
      close,
      renameSpace,
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceUpdateForm.scss"></style>
