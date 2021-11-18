<template>
  <div class="project-card-leave-guard">
    <div class="project-card-leave-guard__title">
      {{ $t("ProjectCardLeaveGuard.title") }}
      <BIMDataButton
        data-test="btn-close-leave"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <div class="project-card-leave-guard__message">
      {{ $t("ProjectCardLeaveGuard.message") }}
    </div>
    <BIMDataButton
      data-test="btn-submit-leave"
      class="project-card-leave-guard__submit-btn"
      color="high"
      fill
      radius
      @click="submit"
    >
      {{ $t("ProjectCardLeaveGuard.leaveButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useProjects } from "@/state/projects";
import { useUser } from "@/state/user";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { deleteProjectUser, softDeleteProject } = useProjects();
    const { user } = useUser();

    const loading = inject("loading", false);

    const submit = async () => {
      try {
        loading.value = true;
        await deleteProjectUser(props.project, user.value);
        softDeleteProject(props.project);
        emit("success");
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
      submit,
      user
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardLeaveGuard.scss"></style>
