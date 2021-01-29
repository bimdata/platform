<template>
  <div class="space-action-menu"
    @click.stop="() => {}"
    v-click-away="closeMenu">

    <BIMDataButton color="default" ghost rounded icon
      class="space-action-menu__btn"
      :class="{ clicked }"
      @click="toggleMenu">
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="space-action-menu__container" v-show="showMenu">
        <transition name="fade" mode="out-in">

          <div class="action-loader" v-if="loading">
            <BIMDataLoading />
          </div>

          <SpaceUpdateForm v-else-if="showUpdateForm"
            :space="space"
            @close="closeUpdateForm"
            @success="closeMenu"
          />

          <SpaceDeleteGuard v-else-if="showDeleteGuard"
            :space="space"
            @close="closeDeleteGuard"
          />

          <div class="action-menu" v-else>
            <BIMDataButton ghost squared
              @click="openUpdateForm">
              {{ $t('Spaces.SpaceActionMenu.rename') }}
            </BIMDataButton>
            <SpaceImageInput
              :space="space"
              @success="closeMenu"
            />
            <BIMDataButton ghost squared
              @click="removeImage">
              {{ $t('Spaces.SpaceActionMenu.removeImage') }}
            </BIMDataButton>
            <BIMDataButton ghost squared
              @click="openDeleteGuard">
              {{ $t('Spaces.SpaceActionMenu.delete') }}
            </BIMDataButton>
          </div>

        </transition>
      </div>
    </transition>

  </div>
</template>

<script>
import { provide, ref } from 'vue';
import { useSpaces } from '@/state/spaces';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataLoading from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataLoading.js";
import SpaceDeleteGuard from '@/components/space-delete-guard/SpaceDeleteGuard';
import SpaceImageInput from '@/components/space-image-input/SpaceImageInput';
import SpaceUpdateForm from '@/components/space-update-form/SpaceUpdateForm';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataLoading,
    SpaceDeleteGuard,
    SpaceImageInput,
    SpaceUpdateForm,
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { removeSpaceImage } = useSpaces();

    const loading = ref(false);
    provide('loading', loading);

    const clicked = ref(false);
    const rippleEffect = () => {
      clicked.value = true;
      setTimeout(() => clicked.value = false, 500);
    };

    const showMenu = ref(false);
    const closeMenu = () => {
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
      showMenu.value = false;
    };
    const toggleMenu = () => {
      rippleEffect();
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
      showMenu.value = !showMenu.value;
    };

    const showUpdateForm = ref(false);
    const openUpdateForm = () => {
      showUpdateForm.value = true;
    };
    const closeUpdateForm = () => {
      showUpdateForm.value = false;
    };

    const removeImage = () => {
      removeSpaceImage({ ...props.space }).then(closeMenu);
    };

    const showDeleteGuard = ref(false);
    const openDeleteGuard = () => {
      showDeleteGuard.value = true;
    };
    const closeDeleteGuard = () => {
      showDeleteGuard.value = false;
    };

    return {
      // References
      clicked,
      loading,
      showDeleteGuard,
      showMenu,
      showUpdateForm,
      // Methods
      closeMenu,
      closeDeleteGuard,
      closeUpdateForm,
      openDeleteGuard,
      openUpdateForm,
      removeImage,
      toggleMenu,
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceActionMenu.scss"></style>
