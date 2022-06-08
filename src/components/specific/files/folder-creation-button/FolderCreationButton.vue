<template>
  <div class="folder-creation-button">
    <BIMDataButton
      class="folder-creation-button__btn"
      :width="width"
      :height="height"
      color="primary"
      fill
      radius
      :disabled="disabled"
      @click="toggle"
    >
      <BIMDataIcon name="addFolder" size="xs" />
      <span v-if="!noText" style="margin-left: 6px">
        {{ $t("FolderCreationButton.buttonText") }}
      </span>
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
import { useToggle } from "@/composables/toggle";
// Components
import FolderCreationForm from "@/components/specific/files/folder-creation-form/FolderCreationForm";

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
    },
    noText: {
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
