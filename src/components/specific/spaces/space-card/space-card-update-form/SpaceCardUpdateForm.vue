<template>
  <div class="space-card-update-form">
    <div class="space-card-update-form__title">
      <span>{{ $t("SpaceCardUpdateForm.title") }}</span>
      <BIMDataButton
        data-test-id="btn-close-update"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIconClose size="xxxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      data-test-id="input-update-name"
      class="space-card-update-form__input"
      :placeholder="$t('t.name')"
      v-model="spaceName"
      :error="hasError"
      :errorMessage="$t('t.invalidName')"
      @keyup.esc.stop="close"
      @keyup.enter.prevent.stop="submit"
    />
    <BIMDataButton
      data-test-id="btn-submit-update"
      class="space-card-update-form__btn-submit"
      fill
      radius
      color="primary"
      @click="submit"
    >
      {{ $t("t.rename") }}
    </BIMDataButton>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useSpaces } from "../../../../../state/spaces.js";
import { debounce } from "../../../../../utils/async.js";

const props = defineProps({
  space: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["close", "success"]);

const { updateSpace } = useSpaces();

const loading = inject("loading", false);

const nameInput = ref(null);
const spaceName = ref(props.space.name);
const hasError = ref(false);

const submit = debounce(async () => {
  if (spaceName.value) {
    try {
      loading.value = true;
      await updateSpace({ ...props.space, name: spaceName.value });
      emit("success");
    } finally {
      loading.value = false;
    }
  } else {
    nameInput.value.focus();
    hasError.value = true;
  }
}, 500);

const close = () => {
  hasError.value = false;
  emit("close");
};

onMounted(() => {
  setTimeout(() => nameInput.value.focus(), 200);
});
</script>

<style scoped src="./SpaceCardUpdateForm.css"></style>
