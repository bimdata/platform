<template>
  <div
    class="space-card-action-menu"
    @click.stop="() => {}"
    v-click-away="closeMenu"
  >
    <BIMDataButton
      data-test="btn-toggle-menu"
      class="space-card-action-menu__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="space-card-action-menu__container" v-show="showMenu">
        <transition name="fade" mode="out-in">
          <div class="space-card-action-menu__container__loader" v-if="loading">
            <BIMDataSpinner />
          </div>

          <SpaceCardUpdateForm
            v-else-if="showUpdateForm"
            :space="space"
            @close="closeUpdateForm"
            @success="closeMenu"
          />

          <SpaceCardDeleteGuard
            v-else-if="showDeleteGuard"
            :space="space"
            @close="closeDeleteGuard"
          />

          <div class="space-card-action-menu__container__menu" v-else>
            <BIMDataButton
              data-test="btn-open-update"
              ghost
              squared
              @click="openUpdateForm"
            >
              {{ $t("SpaceCardActionMenu.renameButtonText") }}
            </BIMDataButton>
            <SpaceCardImageInput :space="space" @upload-completed="closeMenu" />
            <BIMDataButton ghost squared @click="removeImage">
              {{ $t("SpaceCardActionMenu.removeImageButtonText") }}
            </BIMDataButton>
            <BIMDataButton
              data-test="btn-open-delete"
              ghost
              squared
              @click="openDeleteGuard"
            >
              {{ $t("SpaceCardActionMenu.deleteButtonText") }}
            </BIMDataButton>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import SpaceCardDeleteGuard from "../space-card-delete-guard/SpaceCardDeleteGuard";
import SpaceCardImageInput from "../space-card-image-input/SpaceCardImageInput";
import SpaceCardUpdateForm from "../space-card-update-form/SpaceCardUpdateForm";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSpinner,
    SpaceCardDeleteGuard,
    SpaceCardImageInput,
    SpaceCardUpdateForm
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
    provide("loading", loading);

    const showMenu = ref(false);
    const closeMenu = () => {
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
      showMenu.value = false;
    };
    const toggleMenu = () => {
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
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardActionMenu.scss"></style>
