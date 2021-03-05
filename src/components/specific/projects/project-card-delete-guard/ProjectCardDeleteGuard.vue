<template>
  <div class="project-card-delete-guard">
    <div class="project-card-delete-guard__title">
      {{ $t("Projects.ProjectDeleteGuard.title") }}
      <BIMDataButton ghost rounded icon @click="close">
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="project-card-delete-guard__message">
      {{ $t("Projects.ProjectDeleteGuard.message") }}
    </div>
    <BIMDataButton
      fill
      radius
      color="high"
      class="project-card-delete-guard__submit-btn"
      @click="removeProject"
    >
      {{ $t("Projects.ProjectDeleteGuard.buttonDelete") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
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
