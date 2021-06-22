<template>
  <div
    data-test="project-creation-card"
    class="project-creation-card"
    v-click-away="closeCreationForm"
  >
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="project-creation-card__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showCreationForm" class="project-creation-card__form">
        <div class="project-creation-card__form__title">
          {{ $t("ProjectCreationCard.title") }}
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
          class="project-creation-card__form__input"
          :placeholder="$t('ProjectCreationCard.inputPlaceholder')"
          v-model="newProject.name"
          :error="error"
          :errorMessage="$t('ProjectCreationCard.inputErrorMessage')"
          @keyup.esc.stop="closeCreationForm"
          @keyup.enter.stop="submit"
        />
        <BIMDataButton
          data-test="btn-submit-create"
          class="project-creation-card__form__btn-submit"
          fill
          radius
          color="primary"
          @click="submit"
        >
          {{ $t("ProjectCreationCard.createButtonText") }}
        </BIMDataButton>
      </div>

      <div
        v-else
        data-test="btn-open-create"
        class="project-creation-card__btn-open"
        @click="openCreationForm"
      >
        <div class="project-creation-card__btn-open__icon">
          <BIMDataIcon name="plus" size="l" />
        </div>
        <div class="project-creation-card__btn-open__text">
          {{ $t("ProjectCreationCard.text") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataSpinner
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { createProject } = useProjects();

    const loading = ref(false);
    const nameInput = ref(null);

    const newProject = reactive({ name: "" });
    const error = ref(false);
    const submit = async () => {
      if (newProject.name) {
        loading.value = true;
        await createProject(props.space, newProject);
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
      newProject.name = "";
      error.value = false;
      showCreationForm.value = false;
    };

    return {
      // References
      error,
      loading,
      nameInput,
      newProject,
      showCreationForm,
      // Methods
      closeCreationForm,
      openCreationForm,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCreationCard.scss"></style>
