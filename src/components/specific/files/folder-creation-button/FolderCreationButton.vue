<template>
  <div class="folder-creation-button">
    <BIMDataButton
      class="folder-creation-button__btn"
      :width="width"
      :height="height"
      :color="color"
      fill
      radius
      :disabled="disabled"
      @click="toggle"
    >
      <slot>
        <BIMDataIconAddFolder size="xs" margin="0 6px 0 0" />
        {{ $t("FolderCreationButton.buttonText") }}
      </slot>
    </BIMDataButton>

    <transition name="fade">
      <FolderCreationForm
        v-if="showCreationForm"
        class="folder-creation-button__form"
        :project="project"
        :folder="folder"
        @close="close"
        @success="close"
      />
    </transition>
  </div>
</template>

<script>
import { useToggle } from "../../../../composables/toggle.js";
// Components
import FolderCreationForm from "../folder-creation-form/FolderCreationForm.vue";

export default {
  components: {
    FolderCreationForm
  },
  props: {
    width: {
      type: String,
      default: "32px"
    },
    height: {
      type: String,
      default: "32px"
    },
    color: {
      type: String,
      default: "primary"
    },
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { isOpen: showCreationForm, close, toggle } = useToggle();

    return {
      // References
      showCreationForm,
      // Methods
      close,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderCreationButton.scss"></style>
