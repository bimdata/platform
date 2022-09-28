<template>
  <div class="space-card-delete-guard">
    <div class="space-card-delete-guard__title">
      <span>{{ $t("SpaceCardDeleteGuard.title") }}</span>
      <BIMDataButton
        data-test-id="btn-close-delete"
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
      data-test-id="btn-submit-delete"
      class="space-card-delete-guard__btn-submit"
      color="high"
      fill
      radius
      @click="submit"
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
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { deleteSpace } = useSpaces();

    const loading = inject("loading", false);

    const submit = async () => {
      try {
        loading.value = true;
        await deleteSpace(props.space);
        emit("success");
      } finally {
        loading.value = false;
      }
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardDeleteGuard.scss"></style>
