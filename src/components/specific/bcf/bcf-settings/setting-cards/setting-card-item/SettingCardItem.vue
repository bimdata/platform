<template>
  <li class="setting-card-item flex items-center justify-between p-x-12 m-b-6">
    <span v-if="!editTopicExtension">{{ topicChild[1] }}</span>
    <transition v-else>
      <BIMDataInput v-model="topicChild[1]" @keyup.enter.stop="submit" />
    </transition>
    <div class="flex items-center">
      <BIMDataIcon
        v-if="!editTopicExtension"
        name="edit"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editTopicExtension = true"
      />
      <BIMDataIcon
        v-else
        name="close"
        size="xxs"
        fill
        color="default"
        margin="0 12px 0 0"
        @click="editTopicExtension = false"
      />
      <BIMDataIcon
        name="delete"
        size="xxs"
        fill
        color="high"
        margin="0 12px 0 0"
        @click="deleteTopicExtension(extension.child)"
      />
      <span
        class="setting-card-item__color"
        :style="{
          'border-color': adjust(`${topicExtension.color}`, -50),
          'background-color': `#${topicExtension.color}`
        }"
        @click="displayColorSelector = true"
      >
      </span>
      <ColorSelector
        v-if="displayColorSelector"
        class="setting-card-item__color-selector"
        :selectedColor="topicExtension.color"
        @color-select="
          extension.child.color = $event.value;
          displayColorSelector = false;
        "
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
import { reactive, ref } from "vue";

import ColorSelector from "@/components/generic/color-selector/ColorSelector.vue";

export default {
  props: {
    title: {
      type: String
    },
    topicExtension: {
      type: Object
    }
  },
  emits: ["edit", "delete"],

  components: {
    ColorSelector
  },

  setup(props, { emit }) {
    const editTopicExtension = ref(false);
    const extension = reactive({ child: props.topicExtension });

    const submit = () => {
      console.log(extension.child);
      if (
        extension.child.color !== props.topicExtension.color ||
        extension.child.priority !== topicChild[1]
      ) {
        emit("edit", extension.child);
      }
    };

    const deleteTopicExtension = () => {
      emit("delete", extension.child);
    };

    const topicChild = Object.values(props.topicExtension);

    const displayColorSelector = ref(false);
    const adjust = (color, amount) => {
      return (
        "#" +
        color
          .replace(/^#/, "")
          .replace(/../g, color =>
            (
              "0" +
              Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
                16
              )
            ).substr(-2)
          )
      );
    };

    return {
      displayColorSelector,
      extension,
      editTopicExtension,
      topicChild,
      submit,
      deleteTopicExtension,
      adjust
    };
  }
};
</script>

<style scoped lang="scss" src="../SettingCardItem.scss"></style>
