<template>
  <div class="space-card-delete-guard">
    <div class="space-card-delete-guard__title">
      {{ $t("SpaceCardDeleteGuard.title") }}
    </div>
    <BIMDataButton
      data-test="btn-close-delete"
      class="space-card-delete-guard__btn-close"
      ghost
      rounded
      icon
      @click="close"
    >
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
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
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
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
