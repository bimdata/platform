<template>
  <div class="space-card-update-form">
    <div class="space-card-update-form__title">
      <span>{{ $t("SpaceCardUpdateForm.title") }}</span>
      <BIMDataButton
        data-test="btn-close-update"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      data-test="input-update-name"
      class="space-card-update-form__input"
      :placeholder="$t('SpaceCardUpdateForm.inputPlaceholder')"
      v-model="spaceName"
      :error="hasError"
      :errorMessage="$t('SpaceCardUpdateForm.inputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.prevent.stop="submit"
    />
    <BIMDataButton
      data-test="btn-submit-update"
      class="space-card-update-form__btn-submit"
      fill
      radius
      color="primary"
      @click="submit"
    >
      {{ $t("SpaceCardUpdateForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
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
    const { updateSpace } = useSpaces();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const spaceName = ref(props.space.name);
    const hasError = ref(false);

    const submit = async () => {
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
    };

    const close = () => {
      hasError.value = false;
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      hasError,
      nameInput,
      spaceName,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardUpdateForm.scss"></style>
