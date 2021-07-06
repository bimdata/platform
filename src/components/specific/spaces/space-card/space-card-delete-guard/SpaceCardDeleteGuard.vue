<template>
  <div class="space-card-delete-guard">
    <div class="space-card-delete-guard__title">
      <span>{{ $t("SpaceCardDeleteGuard.title") }}</span>
      <BIMDataButton
        data-test="btn-close-delete"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="space-card-delete-guard__message">
      {{ $t("SpaceCardDeleteGuard.message") }}
    </div>
    <BIMDataButton
      data-test="btn-submit-delete"
      class="space-card-delete-guard__btn-submit"
      color="high"
      fill
      radius
      @click="removeSpace"
    >
      {{ $t("SpaceCardDeleteGuard.deleteButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useSpaces } from "@/state/spaces";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { deleteSpace } = useSpaces();

    const loading = inject("loading", false);

    const removeSpace = () => {
      loading.value = true;
      deleteSpace({ ...props.space });
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      removeSpace
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardDeleteGuard.scss"></style>
