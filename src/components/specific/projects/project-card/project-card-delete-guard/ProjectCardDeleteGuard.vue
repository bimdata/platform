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
      @click="removeProject"
    >
      {{ $t("ProjectCardDeleteGuard.deleteButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useProjects } from "@/state/projects";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { deleteProject } = useProjects();

    const loading = inject("loading", false);

    const removeProject = () => {
      loading.value = true;
      deleteProject(props.project);
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      removeProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardDeleteGuard.scss"></style>
