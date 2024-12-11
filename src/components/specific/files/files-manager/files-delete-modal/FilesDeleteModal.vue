<template>
  <BIMDataSafeZoneModal width="800px">
    <template #title>
      {{
        $t("FilesDeleteModal.title",
        {
          filesCount: files.length,
        })
      }}
    </template>
    <template #text>
      <span>
        {{ $t(`FilesDeleteModal.${hasVersions ? "messageVersion" : "message"}`) }}
      </span>
      <ul class="files-delete-modal__content__message__list">
        <li
          class="files-delete-modal__content__message__list__item"
          v-for="file of files"
          :key="file.id"
        >
          <span>{{ file.name }}</span>
        </li>
      </ul>
    </template>
    <template #actions>
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
    </template>
  </BIMDataSafeZoneModal>
</template>

<script>
import { computed } from "vue";
import { useFiles } from "../../../../../state/files.js";
import { useModels } from "../../../../../state/models.js";
import { getModels } from "../../../../../utils/file-structure.js";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { deleteFiles, softUpdateFileStructure } = useFiles();
    const { softDeleteModels } = useModels();

    const hasVersions = computed(() => props.files.some((file) => file.history?.length > 1));

    const close = () => {
      props.onClose();
    };

    const submit = () => {
      deleteFiles(props.project, props.files);
      softUpdateFileStructure("delete", props.files);
      const models = props.files.flatMap(file => getModels(file));
      softDeleteModels(models);
      close();
    };

    return {
      submit,
      close,
      hasVersions,
    };
  },
};
</script>

<style scoped lang="scss">
ul {
  padding: 0 calc(var(--spacing-unit) * 3);
  max-height: 300px;
  line-height: 1.5;
  overflow: auto;
  text-align: left;
  li {
    margin-bottom: calc(var(--spacing-unit) / 2);
  }
}
</style>
