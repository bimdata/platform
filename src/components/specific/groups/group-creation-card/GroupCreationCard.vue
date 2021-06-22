<template>
  <div
    data-test="group-creation-card"
    class="group-creation-card"
    v-click-away="closeCreationForm"
  >
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="group-creation-card__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showCreationForm" class="group-creation-card__form">
        <div class="group-creation-card__form__title">
          {{ $t("GroupCreationCard.title") }}
          <BIMDataButton
            data-test="btn-close-create"
            ghost
            rounded
            icon
            @click.stop="closeCreationForm"
          >
            <BIMDataIcon name="close" size="xxs" />
          </BIMDataButton>
        </div>
        <BIMDataInput
          ref="nameInput"
          data-test="input-create-name"
          class="group-creation-card__form__input"
          :placeholder="$t('GroupCreationCard.inputPlaceholder')"
          v-model="newGroup.name"
          :error="error"
          :errorMessage="$t('GroupCreationCard.inputErrorMessage')"
          @keyup.esc.stop="closeCreationForm"
          @keyup.enter.stop="submit"
        />
        <BIMDataButton
          data-test="btn-submit-create"
          class="group-creation-card__form__btn-submit"
          fill
          radius
          color="primary"
          @click="submit"
        >
          {{ $t("GroupCreationCard.submitButtonText") }}
        </BIMDataButton>
      </div>

      <div
        v-else
        data-test="btn-open-create"
        class="group-creation-card__btn-open"
        @click="openCreationForm"
      >
        <div class="group-creation-card__btn-open__icon">
          <BIMDataIcon name="plus" size="l" />
        </div>
        <div class="group-creation-card__btn-open__text">
          {{ $t("GroupCreationCard.text") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useGroups } from "@/state/groups";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { createGroup } = useGroups();

    const loading = ref(false);
    const nameInput = ref(null);

    const newGroup = reactive({ name: "" });
    const error = ref(false);
    const submit = async () => {
      if (newGroup.name) {
        loading.value = true;
        await createGroup(props.project, newGroup);
        loading.value = false;
        closeCreationForm();
      } else {
        nameInput.value.focus();
        error.value = true;
      }
    };

    const showCreationForm = ref(false);
    const openCreationForm = () => {
      showCreationForm.value = true;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeCreationForm = () => {
      newGroup.name = "";
      error.value = false;
      showCreationForm.value = false;
    };

    return {
      // References
      error,
      loading,
      nameInput,
      newGroup,
      showCreationForm,
      // Methods
      closeCreationForm,
      openCreationForm,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCreationCard.scss"></style>
