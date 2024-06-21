<template>
  <BIMDataSafeZoneModal width="800px">
    <template #title>
      {{
        $t("VisasDeleteModal.title", {
          visasCount: visas.length,
        })
      }}
    </template>
    <template #text>
      <span>
        {{ $t(`VisasDeleteModal.message`) }}
      </span>
      <ul class="visas-delete-modal__content__message__list">
        <li
          class="visas-delete-modal__content__message__list__item"
          v-for="visa of visas"
          :key="visa.id"
        >
          <span>{{ visa.document.name }}</span>
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
import { useVisa } from "../../../../../state/visa.js";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    visas: {
      type: Array,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    document: {
      type: Object,
    },
  },
  setup(props) {
    const { deleteMultipleVisa } = useVisa();

    const close = () => {
      props.onClose();
    };

    const submit = () => {
      deleteMultipleVisa(props.project, props.document, props.visas)
        .then(() => console.log("All delete operations completed"))
        .catch((error) => console.error("Error in delete operations:", error));
    };

    return {
      submit,
      close,
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
