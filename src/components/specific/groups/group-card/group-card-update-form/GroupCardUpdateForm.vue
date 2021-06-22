<template>
  <div class="group-card-update-form">
    <div class="group-card-update-form__title">
      {{ $t("GroupCardUpdateForm.title") }}
      <BIMDataButton
        data-test="btn-close-update"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      data-test="input-update-name"
      class="group-card-update-form__input"
      :placeholder="$t('GroupCardUpdateForm.inputPlaceholder')"
      v-model="groupName"
      :error="error"
      :errorMessage="$t('GroupCardUpdateForm.inputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="submit"
    />
    <BIMDataButton
      data-test="btn-submit-update"
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
import { useGroups } from "@/state/groups";

export default {
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { updateGroup } = useGroups();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const groupName = ref(props.group.name);
    const error = ref(false);
    const submit = async () => {
      if (groupName.value) {
        try {
          loading.value = true;
          await updateGroup(props.group.project, {
            ...props.group,
            name: groupName.value
          });
          emit("success");
        } catch (error) {
          emit("error", error);
        }
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
