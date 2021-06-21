<template>
  <div class="group-card-delete-guard">
    <div class="group-card-delete-guard__title">
      {{ $t("GroupCardDeleteGuard.title") }}
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
    <div class="group-card-delete-guard__message">
      {{ $t("GroupCardDeleteGuard.message", { name: group.name }) }}
    </div>
    <BIMDataButton
      data-test="btn-submit-delete"
      class="group-card-delete-guard__btn-submit"
      color="high"
      fill
      radius
      @click="removeGroup"
    >
      {{ $t("GroupCardDeleteGuard.deleteButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useGroups } from "@/state/groups";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { deleteGroup } = useGroups();

    const loading = inject("loading", false);

    const removeGroup = () => {
      loading.value = true;
      deleteGroup(props.group);
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      removeGroup
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCardDeleteGuard.scss"></style>
