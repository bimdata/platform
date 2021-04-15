<template>
  <div class="project-card-update-form">
    <div class="project-card-update-form__title">
      {{ $t("ProjectCardUpdateForm.title") }}
      <BIMDataButton ghost rounded icon @click="close">
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      class="project-card-update-form__input"
      :placeholder="$t('ProjectCardUpdateForm.inputPlaceholder')"
      v-model="projectName"
      :error="error"
      :errorMessage="$t('ProjectCardUpdateForm.inputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="renameProject"
    />
    <BIMDataButton
      fill
      radius
      color="primary"
      class="project-card-update-form__submit-btn"
      @click="renameProject"
    >
      {{ $t("ProjectCardUpdateForm.renameButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useProjects } from "@/state/projects";
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
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { updateProject } = useProjects();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const projectName = ref(props.project.name);
    const error = ref(false);
    const renameProject = () => {
      if (projectName.value) {
        loading.value = true;
        updateProject({
          ...props.project,
          name: projectName.value
        })
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

    onMounted(() => setTimeout(() => nameInput.value.focus(), 200));

    return {
      // References
      error,
      nameInput,
      projectName,
      // Methods
      close,
      renameProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardUpdateForm.scss"></style>
