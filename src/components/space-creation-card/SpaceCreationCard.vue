<template>
  <BIMDataCard class="space-creation-card"
    :submenuText="$t('Spaces.SpaceCreationCard.title')">
    <template #right>
      <BIMDataButton ghost rounded
        @click="close">
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </template>
    <template #content>
      <BIMDataInput ref="nameInput"
        :placeholder="$t('Spaces.SpaceCreationCard.inputName')"
        v-model="newSpace.name"
      />
      <BIMDataButton fill radius color="primary"
        @click="createSpace">
        {{ $t('Spaces.SpaceCreationCard.buttonCreate') }}
      </BIMDataButton>
    </template>
  </BIMDataCard>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import BIMDataCard from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js';
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataInput from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js';

export default {
  components: {
    BIMDataCard,
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput
  },
  emits: [
    'close'
  ],
  setup(props, { emit }) {
    const { createSpace: create } = useSpacesState();

    const nameInput = ref(null);
    const newSpace = reactive({ name: '' });

    const close = () => emit('close');
    const createSpace = () => create(newSpace).then(close);

    onMounted(() => nameInput.value.focus());

    return {
      nameInput,
      newSpace,
      close,
      createSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceCreationCard.scss"></style>
