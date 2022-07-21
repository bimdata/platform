<template>
  <div
    data-test="group-creation-card"
    class="group-creation-card"
    v-click-away="closeCreationForm"
  >
    <transition name="fade" mode="out-in">
      <template v-if="loading">
        <div class="group-creation-card__loader">
          <BIMDataSpinner />
        </div>
      </template>

      <template v-else-if="showCreationForm">
        <div class="group-creation-card__form">
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
            v-model="groupName"
            :error="hasError"
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
      </template>

      <template v-else>
        <div
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
      </template>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
import colors from "../../../../config/group-colors.js";
import { useGroups } from "../../../../state/groups.js";
import { debounce } from "../../../../utils/async.js";
import { getRandomElement } from "../../../../utils/random.js";

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
    const groupName = ref("");
    const hasError = ref(false);

    const submit = debounce(async () => {
      if (groupName.value) {
        try {
          loading.value = true;
          await createGroup(props.project, {
            name: groupName.value,
            color: getRandomElement(colors)
          });
          closeCreationForm();
        } finally {
          loading.value = false;
        }
      } else {
        nameInput.value.focus();
        hasError.value = true;
      }
    }, 500);

    const showCreationForm = ref(false);
    const openCreationForm = () => {
      showCreationForm.value = true;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeCreationForm = () => {
      groupName.value = "";
      hasError.value = false;
      showCreationForm.value = false;
    };

    return {
      // References
      hasError,
      loading,
      nameInput,
      groupName,
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
