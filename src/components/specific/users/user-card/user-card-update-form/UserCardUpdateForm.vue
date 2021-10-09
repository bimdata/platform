<template>
  <div class="user-card-update-form">
    <span class="user-card-update-form__input">
      <template v-if="project">
        <BIMDataRadio name="role" text="Guest" :value="25" v-model="role" />
      </template>
      <BIMDataRadio name="role" text="User" :value="50" v-model="role" />
      <BIMDataRadio name="role" text="Admin" :value="100" v-model="role" />
    </span>
    <BIMDataButton
      data-test="btn-submit-update"
      class="user-card-update-form__btn-submit"
      width="80px"
      color="primary"
      fill
      radius
      @click="submit"
    >
      {{ $t("UserCardUpdateForm.submitButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      data-test="btn-close-update"
      class="user-card-update-form__btn-close"
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
import { inject, ref } from "vue";
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
    const { updateSpaceUser } = useSpaces();
    const { updateProjectUser } = useProjects();

    const loading = inject("loading", false);

    const role = ref(
      props.project ? props.user.projectRole : props.user.cloudRole
    );

    const submit = async () => {
      try {
        loading.value = true;
        if (props.project) {
          await updateProjectUser(props.project, {
            ...props.user,
            projectRole: role.value,
            role: role.value
          });
        } else if (props.space) {
          await updateSpaceUser(props.space, {
            ...props.user,
            cloudRole: role.value,
            role: role.value
          });
        }
      } finally {
        loading.value = false;
      }
      close();
    };

    const close = () => {
      emit("close");
    };

    return {
      // Reference
      role,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCardUpdateForm.scss"></style>
