<template>
  <BIMDataCard
    data-test="space-creation-card"
    class="space-creation-card"
    :submenuText="$t('SpaceCreationCard.title')"
  >
    <template #right>
      <BIMDataButton
        data-test="btn-close-create"
        ghost
        rounded
        icon
        v-show="!loading"
        @click="close"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </template>
    <template #content>
      <transition name="fade" mode="out-in">
        <template v-if="loading">
          <div class="action-loader">
            <BIMDataSpinner />
          </div>
        </template>

        <template v-else>
          <div class="creation-form">
            <BIMDataInput
              ref="nameInput"
              data-test="input-create-name"
              :placeholder="$t('SpaceCreationCard.inputPlaceholder')"
              v-model="newSpace.name"
              :error="hasError"
              :errorMessage="$t('SpaceCreationCard.inputErrorMessage')"
              @keyup.esc.stop="close"
              @keyup.enter.stop="submit"
            />
            <BIMDataButton
              data-test="btn-submit-create"
              fill
              radius
              color="primary"
              @click="submit"
            >
              {{ $t("SpaceCreationCard.createButtonText") }}
            </BIMDataButton>
          </div>
        </template>
      </transition>
    </template>
  </BIMDataCard>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useErrors } from "@/composables/errors";
import { useSpaces } from "@/state/spaces";

export default {
  emits: ["close"],
  setup(props, { emit }) {
    const { handleError, SPACE_CREATE_ERROR } = useErrors();
    const { createSpace } = useSpaces();

    const loading = ref(false);
    const nameInput = ref(null);
    const newSpace = reactive({ name: "" });
    const hasError = ref(false);

    const submit = async () => {
      if (newSpace.name) {
        try {
          loading.value = true;
          await createSpace(newSpace);
          close();
        } catch (error) {
          handleError(SPACE_CREATE_ERROR, error);
        } finally {
          loading.value = false;
        }
      } else {
        nameInput.value.focus();
        hasError.value = true;
      }
    };

    const close = () => {
      newSpace.name = "";
      hasError.value = false;
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 400);
    });

    return {
      // References
      hasError,
      loading,
      nameInput,
      newSpace,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCreationCard.scss"></style>
