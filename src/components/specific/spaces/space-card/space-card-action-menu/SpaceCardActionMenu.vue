<template>
  <div
    class="space-card-action-menu"
    @click.prevent.stop="() => {}"
    v-click-away="closeMenu"
  >
    <BIMDataButton
      data-test-id="btn-toggle-menu"
      class="space-card-action-menu__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIconEllipsis size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="space-card-action-menu__container" v-show="showMenu">
        <div class="space-card-action-menu__container__loader" v-show="loading">
          <BIMDataSpinner />
        </div>

        <transition name="fade" mode="out-in">
          <template v-if="showUpdateForm">
            <SpaceCardUpdateForm
              :space="space"
              @close="closeUpdateForm"
              @success="closeMenu"
            />
          </template>

          <template v-else-if="showDeleteGuard">
            <SpaceCardDeleteGuard :space="space" @close="closeDeleteGuard" />
          </template>

          <template v-else>
            <div class="space-card-action-menu__container__menu">
              <BIMDataButton ghost squared @click="toggleFavorite">
                {{
                  $t(
                    `SpaceCardActionMenu.${
                      isFavoriteSpace(space)
                        ? "removeFavorite"
                        : "addToFavorite"
                    }`
                  )
                }}
              </BIMDataButton>
              <BIMDataButton
                v-if="isSpaceAdmin(space)"
                data-test-id="btn-open-update"
                ghost
                squared
                @click="openUpdateForm"
              >
                {{ $t("t.rename") }}
              </BIMDataButton>
              <SpaceCardImageButton
                v-if="isSpaceAdmin(space)"
                data-test-id="btn-update-image"
                :space="space"
                @upload-completed="closeMenu"
              />
              <BIMDataButton
                v-if="isSpaceAdmin(space) && space.image"
                data-test-id="btn-delete-image"
                ghost
                squared
                @click="removeImage"
              >
                {{ $t("SpaceCardActionMenu.removeImageButtonText") }}
              </BIMDataButton>
              <BIMDataButton
                v-if="isSpaceAdmin(space)"
                data-test-id="btn-open-delete"
                color="high"
                ghost
                squared
                @click="openDeleteGuard"
              >
                {{ $t("t.delete") }}
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
import { useToggle } from "../../../../../composables/toggle.js";
import { useSpaces } from "../../../../../state/spaces.js";
import { useUser } from "../../../../../state/user.js";
// Components
import SpaceCardDeleteGuard from "../space-card-delete-guard/SpaceCardDeleteGuard.vue";
import SpaceCardImageButton from "../space-card-image-button/SpaceCardImageButton.vue";
import SpaceCardUpdateForm from "../space-card-update-form/SpaceCardUpdateForm.vue";

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
    const { isSpaceAdmin, isFavoriteSpace, addFavoriteSpace, removeFavoriteSpace } =
      useUser();
    const { removeSpaceImage } = useSpaces();

    const loading = ref(false);
    provide("loading", loading);

    const toggleFavorite = async () => {
      if (isFavoriteSpace(props.space)) {
        await removeFavoriteSpace(props.space);
      } else {
        await addFavoriteSpace(props.space);
      }
    };

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
      isFavoriteSpace,
      isSpaceAdmin,
      openDeleteGuard,
      openUpdateForm,
      removeImage,
      toggleFavorite,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardActionMenu.scss"></style>
