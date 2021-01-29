<template>
  <BIMDataCard class="space-creation-card"
    :submenuText="$t('Spaces.SpaceCreationCard.title')">
    <template #right>
      <BIMDataButton ghost rounded icon v-show="!loading"
        @click="close">
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </template>
    <template #content>
      <transition name="fade" mode="out-in">

        <div class="action-loader"  v-if="loading">
          <BIMDataLoading />
        </div>

        <div class="creation-form" v-else>
          <BIMDataInput ref="nameInput"
            :placeholder="$t('Spaces.SpaceCreationCard.inputName')"
            v-model="newSpace.name"
            :error="error"
            :errorMessage="$t('Spaces.SpaceCreationCard.errorMessage')"
          />
          <BIMDataButton fill radius color="primary"
            @click="createSpace">
            {{ $t('Spaces.SpaceCreationCard.buttonCreate') }}
          </BIMDataButton>
        </div>

      </transition>
    </template>
  </BIMDataCard>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { useSpaces } from '@/state/spaces';
// Components
import BIMDataCard from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js';
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataInput from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js';
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataLoading.js";

export default {
  components: {
    BIMDataCard,
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataLoading,
  },
  emits: [
    'close'
  ],
  setup(props, { emit }) {
    const { createSpace: create } = useSpaces();

    const loading = ref(false);
    const nameInput = ref(null);
    const newSpace = reactive({ name: '' });
    const error = ref(false);

    const createSpace = () => {
      if (newSpace.name) {
        loading.value = true;
        create(newSpace).then(() => {
          loading.value = false;
          close();
        });
      } else {
        nameInput.value.focus();
        error.value = true;
      }
    };
    
    const close = () => {
      newSpace.name = '';
      error.value = false;
      emit('close');
    };

    onMounted(
      () => setTimeout(() => nameInput.value.focus(), 400)
    );

    return {
      // References
      error,
      loading,
      nameInput,
      newSpace,
      // Methods
      close,
      createSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceCreationCard.scss"></style>
