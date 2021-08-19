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
          <template v-if="loading">
            <div class="space-card-action-menu__container__loader">
              <BIMDataSpinner />
            </div>
          </template>

          <template v-else-if="showUpdateForm">
            <SpaceCardUpdateForm
              data-test="update-form"
              :space="space"
              @close="closeUpdateForm"
              @success="closeMenu"
            />
          </template>

          <template v-else-if="showDeleteGuard">
            <SpaceCardDeleteGuard
              data-test="delete-guard"
              :space="space"
              @close="closeDeleteGuard"
            />
          </template>

          <template v-else>
            <div class="space-card-action-menu__container__menu">
              <BIMDataButton
                data-test="btn-open-update"
                ghost
                squared
                @click="openUpdateForm"
              >
                {{ $t("SpaceCardActionMenu.renameButtonText") }}
              </BIMDataButton>
              <SpaceCardImageButton
                data-test="btn-update-image"
                :space="space"
                @upload-completed="closeMenu"
              />
              <BIMDataButton
                data-test="btn-delete-image"
                ghost
                squared
                @click="removeImage"
              >
                {{ $t("SpaceCardActionMenu.removeImageButtonText") }}
              </BIMDataButton>
              <BIMDataButton
                data-test="btn-open-delete"
                color="high"
                ghost
                squared
                @click="openDeleteGuard"
              >
                {{ $t("SpaceCardActionMenu.deleteButtonText") }}
              </BIMDataButton>
            </div>
          </template>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
import { useErrors } from "@/composables/errors";
import { useToggle } from "@/composables/toggle";
import { useSpaces } from "@/state/spaces";
// Components
import SpaceCardDeleteGuard from "../space-card-delete-guard/SpaceCardDeleteGuard";
import SpaceCardImageButton from "../space-card-image-button/SpaceCardImageButton";
import SpaceCardUpdateForm from "../space-card-update-form/SpaceCardUpdateForm";

export default {
  components: {
    SpaceCardDeleteGuard,
    SpaceCardImageButton,
    SpaceCardUpdateForm
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { handleError, SPACE_IMAGE_DELETE_ERROR } = useErrors();
    const { removeSpaceImage } = useSpaces();

    const loading = ref(false);
    provide("loading", loading);

    const {
      isOpen: showUpdateForm,
      open: openUpdateForm,
      close: closeUpdateForm
    } = useToggle();
    const {
      isOpen: showDeleteGuard,
      open: openDeleteGuard,
      close: closeDeleteGuard
    } = useToggle();

    const reset = () => {
      closeUpdateForm();
      closeDeleteGuard();
      loading.value = false;
    };

    const showMenu = ref(false);
    const closeMenu = () => {
      reset();
      showMenu.value = false;
    };
    const toggleMenu = () => {
      reset();
      showMenu.value = !showMenu.value;
    };

    const removeImage = async () => {
      try {
        loading.value = true;
        await removeSpaceImage(props.space);
        closeMenu();
      } catch (error) {
        handleError(SPACE_IMAGE_DELETE_ERROR, error);
      } finally {
        loading.value = false;
      }
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
