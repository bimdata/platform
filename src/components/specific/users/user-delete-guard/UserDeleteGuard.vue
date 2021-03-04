<template>
  <div class="user-delete-guard">
    <span class="user-delete-guard__message">
      {{ $t("User.UserDeleteGuard.message", { name: user.firstname }) }}
    </span>
    <BIMDataButton
      class="user-delete-guard__delete-btn"
      width="80px"
      color="high"
      fill
      radius
      @click="removeSpaceUser"
    >
      {{ $t("User.UserDeleteGuard.buttonDelete") }}
    </BIMDataButton>
    <BIMDataButton
      class="user-delete-guard__close-btn"
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
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { currentSpace, deleteSpaceUser } = useSpaces();

    const loading = inject("loading", false);

    const removeSpaceUser = () => {
      loading.value = true;
      deleteSpaceUser(currentSpace.value, props.user);
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

<style scoped lang="scss" src="./UserDeleteGuard.scss"></style>
