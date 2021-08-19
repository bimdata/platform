<template>
  <div class="project-card-delete-guard">
    <div class="project-card-delete-guard__title">
      {{ $t("ProjectCardDeleteGuard.title") }}
      <BIMDataButton
        data-test="btn-close-delete"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <div class="project-card-delete-guard__message">
      {{ $t("ProjectCardDeleteGuard.message") }}
    </div>
    <BIMDataButton
      data-test="btn-submit-delete"
      class="project-card-delete-guard__submit-btn"
      color="high"
      fill
      radius
      @click="submit"
    >
      {{ $t("ProjectCardDeleteGuard.deleteButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useErrors } from "@/composables/errors";
import { useProjects } from "@/state/projects";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { handleError, PROJECT_DELETE_ERROR } = useErrors();
    const { deleteProject } = useProjects();

    const loading = inject("loading", false);

    const submit = async () => {
      try {
        loading.value = true;
        await deleteProject(props.project);
        emit("success");
      } catch (error) {
        handleError(PROJECT_DELETE_ERROR, error);
      } finally {
        loading.value = false;
      }
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardDeleteGuard.scss"></style>
