<template>
  <div class="group-card-color-picker">
    <div class="group-card-color-picker__grid">
      <div
        class="group-card-color-picker__grid__item"
        v-for="color of AVAILABLE_COLORS"
        :key="color"
        :class="{ selected: groupColor === color }"
        :style="{ backgroundColor: color }"
        @click="groupColor = color"
      ></div>
    </div>
    <div class="group-card-color-picker__side">
      <BIMDataButton
        data-test-id="btn-close-color"
        class="group-card-color-picker__side__btn-close"
        ghost
        rounded
        icon
        @click="submit"
      >
        <BIMDataIconClose size="xxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { AVAILABLE_COLORS } from "../../../../../config/groups.js";
import { useGroups } from "../../../../../state/groups.js";
import { debounce } from "../../../../../utils/async.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { updateGroup } = useGroups();

    const loading = inject("loading", false);

    const groupColor = ref(props.group.color);

    const submit = debounce(async () => {
      if (groupColor.value !== props.group.color) {
        try {
          loading.value = true;
          await updateGroup(props.project, {
            ...props.group,
            color: groupColor.value
          });
          emit("success");
        } finally {
          loading.value = false;
        }
      } else {
        emit("close");
      }
    }, 500);

    return {
      // References
      AVAILABLE_COLORS,
      groupColor,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCardColorPicker.scss"></style>
