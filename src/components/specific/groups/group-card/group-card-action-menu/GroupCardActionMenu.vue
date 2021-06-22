<template>
  <div class="group-card-action-menu" v-click-away="resetMenu">
    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="group-card-action-menu__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="showUpdateForm">
        <GroupCardUpdateForm
          :group="group"
          @close="closeUpdateForm"
          @success="closeMenu"
        />
      </template>

      <template v-else-if="showColorPicker">
        <GroupCardColorPicker
          :group="group"
          @close="closeColorPicker"
          @success="closeMenu"
        />
      </template>

      <template v-else-if="showDeleteGuard">
        <GroupCardDeleteGuard :group="group" @close="closeDeleteGuard" />
      </template>

      <template v-else>
        <div class="group-card-action-menu__menu">
          <div class="group-card-action-menu__menu__title">
            <TextBox :text="group.name" :maxLength="32" />
            <BIMDataButton
              data-test="btn-close-menu"
              ghost
              rounded
              icon
              @click="closeMenu"
            >
              <BIMDataIcon name="close" size="xxs" />
            </BIMDataButton>
          </div>
          <BIMDataButton
            data-test="btn-open-update"
            ghost
            squared
            @click="openUpdateForm"
          >
            {{ $t("GroupCardActionMenu.renameButtonText") }}
          </BIMDataButton>
          <BIMDataButton
            data-test="btn-open-color"
            ghost
            squared
            @click="openColorPicker"
          >
            {{ $t("GroupCardActionMenu.changeColorButtonText") }}
          </BIMDataButton>
          <BIMDataButton
            data-test="btn-open-delete"
            ghost
            squared
            @click="openDeleteGuard"
          >
            {{ $t("GroupCardActionMenu.deleteButtonText") }}
          </BIMDataButton>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import { provide, ref } from "vue";
// Components
import GroupCardColorPicker from "../group-card-color-picker/GroupCardColorPicker";
import GroupCardDeleteGuard from "../group-card-delete-guard/GroupCardDeleteGuard";
import GroupCardUpdateForm from "../group-card-update-form/GroupCardUpdateForm";

export default {
  components: {
    GroupCardColorPicker,
    GroupCardDeleteGuard,
    GroupCardUpdateForm
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const loading = ref(false);
    provide("loading", loading);

    const showUpdateForm = ref(false);
    const openUpdateForm = () => {
      showUpdateForm.value = true;
    };
    const closeUpdateForm = () => {
      showUpdateForm.value = false;
    };

    const showColorPicker = ref(false);
    const openColorPicker = () => {
      showColorPicker.value = true;
    };
    const closeColorPicker = () => {
      showColorPicker.value = false;
    };

    const showDeleteGuard = ref(false);
    const openDeleteGuard = () => {
      showDeleteGuard.value = true;
    };
    const closeDeleteGuard = () => {
      showDeleteGuard.value = false;
    };

    const resetMenu = () => {
      closeColorPicker();
      closeDeleteGuard();
      closeUpdateForm();
      loading.value = false;
    };

    const closeMenu = () => {
      resetMenu();
      emit("close");
    };

    return {
      // References
      loading,
      showColorPicker,
      showDeleteGuard,
      showUpdateForm,
      // Methods
      closeColorPicker,
      closeDeleteGuard,
      closeMenu,
      closeUpdateForm,
      openColorPicker,
      openDeleteGuard,
      openUpdateForm,
      resetMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCardActionMenu.scss"></style>
