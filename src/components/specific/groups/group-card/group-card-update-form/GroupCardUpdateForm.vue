<template>
  <div class="group-card-update-form">
    <div class="group-card-update-form__title">
      {{ $t("GroupCardUpdateForm.title") }}
      <BIMDataButton
        data-test-id="btn-close-update"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIconClose size="xxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      data-test-id="input-update-name"
      class="group-card-update-form__input"
      :placeholder="$t('GroupCardUpdateForm.inputPlaceholder')"
      v-model="groupName"
      :error="hasError"
      :errorMessage="$t('GroupCardUpdateForm.inputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="submit"
    />
    <BIMDataButton
      data-test-id="btn-submit-update"
      class="group-card-update-form__btn-submit"
      color="primary"
      fill
      radius
      @click="submit"
    >
      {{ $t("GroupCardUpdateForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useGroups } from "../../../../../state/groups.js";
import { debounce } from "../../../../../utils/async.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { updateGroup } = useGroups();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const groupName = ref(props.group.name);
    const hasError = ref(false);

    const submit = debounce(async () => {
      if (groupName.value) {
        try {
          loading.value = true;
          await updateGroup(props.project, {
            ...props.group,
            name: groupName.value
          });
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

    return {
      // References
      hasError,
      groupName,
      nameInput,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCardUpdateForm.scss"></style>
