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
      class="user-card-delete-guard__delete-btn"
      width="80px"
      color="high"
      fill
      radius
      @click="removeSpaceUser"
    >
      {{ $t("UserCardDeleteGuard.deleteButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      class="user-card-delete-guard__close-btn"
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
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
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

    const removeSpaceUser = async () => {
      loading.value = true;
      if (props.project) {
        await deleteProjectUser(props.project, props.user);
      } else if (props.space) {
        await deleteSpaceUser(props.space, props.user);
      }
      loading.value = false;
      close();
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      removeSpaceUser
    };
  }
};
</script>

<style scoped lang="scss" src="./UserCardDeleteGuard.scss"></style>
