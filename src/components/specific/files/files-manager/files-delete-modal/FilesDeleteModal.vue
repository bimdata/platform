<template>
  <div class="files-delete-modal p-24">
    <div class="files-delete-modal__actions">
      <BIMDataButton ghost rounded color="default" icon @click="close">
        <BIMDataIconClose size="xxs"  />
      </BIMDataButton>
    </div>
    <div class="files-delete-modal__header flex justify-center">
      {{ $t("FilesDeleteModal.title") }}
    </div>
    <div class="files-delete-modal__content m-y-24">
      <div class="files-delete-modal__content__message">
        <span>
          {{
            $t(`FilesDeleteModal.${hasVersions ? "messageVersion" : "message"}`)
          }}
        </span>
        <ul class="files-delete-modal__content__message__list">
          <li
            class="files-delete-modal__content__message__list__item"
            v-for="file of files"
            :key="file.id"
          >
            <BIMDataTextbox :text="file.name" />
          </li>
        </ul>
      </div>
    </div>
    <div class="files-delete-modal__footer flex justify-center">
      <BIMDataButton ghost radius width="120px" @click="close">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        data-test-id="btn-confirm-delete"
        color="high"
        fill
        radius
        width="120px"
        @click="submit"
      >
        {{ $t("t.delete") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useFiles } from "../../../../../state/files.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    },
    onClose: {
      type: Function,
      required: true,
    }
  },
  setup(props) {
    const { deleteFiles, softUpdateFileStructure } = useFiles();

    const hasVersions = computed(() =>
      props.files.some(file => file.history?.length > 1)
    );

    const close = () => {
      props.onClose();
    }

    const submit = () => {
      deleteFiles(props.project, props.files);
      softUpdateFileStructure("delete", props.files);
      close();
    };

    return {
      submit,
      close,
      hasVersions
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesDeleteModal.scss"></style>
