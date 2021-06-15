<template>
  <div class="folder-creation-button">
    <BIMDataButton
      class="folder-creation-button__btn"
      :width="width"
      :height="height"
      color="primary"
      fill
      radius
      @click="toggle"
    >
      <BIMDataIcon name="addFolder" size="xs" />
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
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";
import FolderCreationForm from "@/components/specific/files/folder-creation-form/FolderCreationForm";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
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
