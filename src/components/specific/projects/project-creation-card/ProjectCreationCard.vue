<template>
  <div class="project-creation-card" v-click-away="closeCreationForm">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="project-creation-card__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showCreationForm" class="project-creation-card__form">
        <div class="project-creation-card__form__title">
          {{ $t("ProjectCreationCard.title") }}
          <BIMDataButton ghost rounded icon @click.stop="closeCreationForm">
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
        <BIMDataInput
          ref="nameInput"
          class="project-creation-card__form__input"
          :placeholder="$t('ProjectCreationCard.inputPlaceholder')"
          v-model="newProject.name"
          :error="error"
          :errorMessage="$t('ProjectCreationCard.inputErrorMessage')"
          @keyup.esc.stop="closeCreationForm"
          @keyup.enter.stop="createProject"
        />
        <BIMDataButton
          fill
          radius
          color="primary"
          class="project-creation-card__form__btn-submit"
          @click="createProject"
        >
          {{ $t("ProjectCreationCard.createButtonText") }}
        </BIMDataButton>
      </div>

      <div v-else class="project-creation-card__btn" @click="openCreationForm">
        <div class="project-creation-card__btn__icon">
          <BIMDataIcon name="plus" size="l" />
        </div>
        <div class="project-creation-card__btn__text">
          {{ $t("ProjectCreationCard.text") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
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
  setup() {
    const { currentSpace } = useSpaces();
    const { createProject: create } = useProjects();

    const loading = ref(false);
    const nameInput = ref(null);

    const newProject = reactive({ name: "" });
    const error = ref(false);
    const createProject = () => {
      if (newProject.name) {
        loading.value = true;
        create(currentSpace.value, newProject).then(() => {
          loading.value = false;
          closeCreationForm();
        });
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
      createProject,
      openCreationForm
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCreationCard.scss"></style>
