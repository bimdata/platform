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
      <BIMDataIcon name="addFolder" size="xs" margin="0 6px 0 0" />
      <span>{{ $t("FolderCreationButton.buttonText") }}</span>
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
import { ref } from "vue";
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
    }
  },
  setup() {
    const showCreationForm = ref(false);
    const close = () => {
      showCreationForm.value = false;
    };
    const toggle = () => {
      showCreationForm.value = !showCreationForm.value;
    };

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
