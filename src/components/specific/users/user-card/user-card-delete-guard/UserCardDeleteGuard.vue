<template>
  <div class="user-card-delete-guard">
    <span class="user-card-delete-guard__message">
      {{
        $t(`UserCardDeleteGuard.message.${!!project ? "project" : "space"}`, {
          name: user.firstname
        })
      }}
    </span>
    <BIMDataButton
      data-test-id="btn-submit-delete"
      class="user-card-delete-guard__btn-submit"
      width="80px"
      color="high"
      fill
      radius
      @click="submit"
    >
      {{ $t("UserCardDeleteGuard.submitButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      data-test-id="btn-close-delete"
      class="user-card-delete-guard__btn-close"
      color="default"
      ghost
      rounded
      icon
      @click="close"
    >
      <BIMDataIcon name="close" size="xxs" />
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    space: {
      type: Object,
      default: null
    },
    project: {
      type: Object,
      default: null
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { deleteSpaceUser } = useSpaces();
    const { deleteProjectUser } = useProjects();

    const loading = inject("loading", false);

    const submit = async () => {
      try {
        loading.value = true;
        if (props.project) {
          await deleteProjectUser(props.project, props.user);
        } else if (props.space) {
          await deleteSpaceUser(props.space, props.user);
        }
        close();
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

<style scoped lang="scss" src="./UserCardDeleteGuard.scss"></style>
