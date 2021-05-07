<template>
  <div class="space-card-update-form">
    <div class="space-card-update-form__title">
      {{ $t("SpaceCardUpdateForm.title") }}
    </div>
    <BIMDataButton
      data-test="btn-close-update"
      class="space-card-update-form__btn-close"
      ghost
      rounded
      icon
      @click="close"
    >
      <BIMDataIcon name="close" size="xxxs" />
    </BIMDataButton>
    <BIMDataInput
      ref="nameInput"
      data-test="input-update-name"
      class="space-card-update-form__input"
      :placeholder="$t('SpaceCardUpdateForm.inputPlaceholder')"
      v-model="spaceName"
      :error="error"
      :errorMessage="$t('SpaceCardUpdateForm.inputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="renameSpace"
    />
    <BIMDataButton
      data-test="btn-submit-update"
      class="space-card-update-form__btn-submit"
      fill
      radius
      color="primary"
      @click="renameSpace"
    >
      {{ $t("SpaceCardUpdateForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useSpaces } from "@/state/spaces";
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
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { updateSpace } = useSpaces();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const spaceName = ref(props.space.name);
    const error = ref(false);
    const renameSpace = () => {
      if (spaceName.value) {
        loading.value = true;
        updateSpace({ ...props.space, name: spaceName.value })
          .then(() => emit("success"))
          .catch(error => emit("error", error));
      } else {
        nameInput.value.focus();
        error.value = true;
      }
    };

    const close = () => {
      error.value = false;
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      error,
      nameInput,
      spaceName,
      // Methods
      close,
      renameSpace
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardUpdateForm.scss"></style>
