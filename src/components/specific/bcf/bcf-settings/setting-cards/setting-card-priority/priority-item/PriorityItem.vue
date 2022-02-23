<template>
  <li class="setting-card-item flex items-center justify-between p-x-12 m-b-6">
    <span v-if="!editpriority">{{ priority.priority }}</span>
    <transition v-else>
      <BIMDataInput v-model="priorityValue" @keyup.enter.stop="submitValue" />
    </transition>
    <div class="flex items-center">
      <BIMDataIcon
        v-if="!editpriority"
        name="edit"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editpriority = true"
      />
      <BIMDataIcon
        v-else
        name="close"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editpriority = false"
      />
      <BIMDataIcon
        name="delete"
        size="xxs"
        fill
        color="high"
        margin="0 12px 0 0"
        @click="deletepriority(priority.child)"
      />
      <span
        class="setting-card-item__color"
        :style="{
          'border-color': adjustColor(`${priority.color}`, -50),
          'background-color': `#${priority.color}`
        }"
        @click="displayColorSelector = true"
      >
      </span>
      <ColorSelector
        v-if="displayColorSelector"
        class="setting-card-item__color-selector"
        :selectedColor="priority.color"
        @color-select="submitColor"
        v-click-away="
          () => {
            displayColorSelector = false;
          }
        "
      />
    </div>
  </li>
</template>

<script>
import { ref } from "vue";
import { adjustColor } from "../../../adjustColor.js";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

import ColorSelector from "@/components/generic/color-selector/ColorSelector.vue";

export default {
  props: {
    priority: {
      type: Object
    }
  },

  components: {
    ColorSelector
  },

  setup(props) {
    const { currentProject } = useProjects();

    const editpriority = ref(false);
    const displayColorSelector = ref(false);
    const { updateTopicExtensionPriority } = useBcf();

    const priorityValue = ref(props.priority.priority);
    const submitValue = async () => {
      if (priorityValue.value !== props.priority.priority) {
        await updateTopicExtensionPriority(
          currentProject.value,
          props.priority.id,
          {
            priority: priorityValue.value
          }
        );
      }
    };

    const submitColor = async color => {
      if (color !== props.priority.color) {
        await updateTopicExtensionPriority(
          currentProject.value,
          props.priority.id,
          { color }
        );
      }
    };

    // const deletepriority = () => {
    //   emit("delete", priority.child);
    // };

    return {
      priorityValue,
      displayColorSelector,
      editpriority,
      submitValue,
      submitColor,
      // deletepriority,
      adjustColor
    };
  }
};
</script>

<style scoped lang="scss" src="../../SettingCardItem.scss"></style>
