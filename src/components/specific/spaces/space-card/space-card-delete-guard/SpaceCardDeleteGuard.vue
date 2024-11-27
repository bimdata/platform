<script setup>
import { inject } from "vue";
import { useSpaces } from "../../../../../state/spaces.js";

const props = defineProps({
  space: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["close", "success"]);

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
</script>

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
        <BIMDataIconClose size="xxxs" />
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
      {{ $t("t.delete") }}
    </BIMDataButton>
  </div>
</template>

<style scoped src="./SpaceCardDeleteGuard.css"></style>
