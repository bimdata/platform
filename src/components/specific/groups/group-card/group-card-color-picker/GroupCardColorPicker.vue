<template>
  <div class="group-card-color-picker">
    <div class="group-card-color-picker__grid">
      <div
        class="group-card-color-picker__grid__item"
        v-for="color of colors"
        :key="color"
        :class="{ selected: groupColor === color }"
        :style="{ backgroundColor: color }"
        @click="groupColor = color"
      ></div>
    </div>
    <div class="group-card-color-picker__side">
      <BIMDataButton
        data-test="btn-close-colors"
        class="group-card-color-picker__side__btn-close"
        ghost
        rounded
        icon
        @click="submit"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import colors from "@/config/group-colors";
import { useGroups } from "@/state/groups";

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

    const submit = async () => {
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
    };

    return {
      // References
      colors,
      groupColor,
      // Methods
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./GroupCardColorPicker.scss"></style>
