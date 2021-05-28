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
      <span>{{ $t("FolderCreationButton.createFolderButtonText") }}</span>
    </BIMDataButton>

    <transition name="fade">
      <div class="folder-creation-button__form" v-show="showCreationForm">
        <div class="folder-creation-button__form__title">
          <BIMDataIcon name="addFolder" size="xs" />
          <span>{{ $t("FolderCreationButton.creationFormTitle") }}</span>
        </div>
        <BIMDataInput
          ref="nameInput"
          class="folder-creation-button__form__input"
          :placeholder="$t('FolderCreationButton.nameInputPlaceholder')"
          v-model="name"
          :error="error"
          :errorMessage="$t('FolderCreationButton.nameInputErrorMessage')"
          @keyup.enter.stop="submit"
        />
        <BIMDataButton
          class="folder-creation-button__form__btn-cancel"
          width="80px"
          ghost
          radius
          @click="close"
        >
          {{ $t("FolderCreationButton.cancelButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="folder-creation-button__form__btn-submit"
          width="80px"
          color="primary"
          fill
          radius
          @click="submit"
        >
          {{ $t("FolderCreationButton.submitButtonText") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useFiles } from "@/state/files";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput
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
      type: Object
    }
  },
  setup(props) {
    const { createFolder } = useFiles();

    const nameInput = ref(null);
    const name = ref("");
    const error = ref(false);

    const submit = async () => {
      if (name.value) {
        await createFolder(props.project, {
          parentId: props.folder.id,
          name: name.value
        });
        close();
      } else {
        nameInput.value.focus();
        error.value = true;
      }
    };

    const showCreationForm = ref(false);
    const close = () => {
      name.value = "";
      error.value = false;
      showCreationForm.value = false;
    };
    const toggle = () => {
      error.value = false;
      showCreationForm.value = !showCreationForm.value;
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      error,
      name,
      nameInput,
      showCreationForm,
      // Methods
      close,
      submit,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderCreationButton.scss"></style>
