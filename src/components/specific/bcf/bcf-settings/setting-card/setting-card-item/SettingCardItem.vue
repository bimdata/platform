<template>
  <li class="setting-card-item flex items-center justify-between p-x-12 m-b-6">
    <span v-if="!editTopicExtension">{{ topicExtension }}</span>
    <transition v-else>
      <BIMDataInput v-model="extension.name" @keyup.enter.stop="submit" />
    </transition>
    <div>
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
        @click="deleteTopicExtension(extension.name)"
      />
    </div>
  </li>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: {
    title: {
      type: String
    },
    topicExtension: {
      type: String
    }
  },
  emits: ["edit", "delete"],

  setup(props, { emit }) {
    const editTopicExtension = ref(false);
    const extension = reactive({ name: props.topicExtension });

    const submit = () => {
      if (extension.name !== props.topicExtension) {
        emit("edit", extension.name);
      }
    };

    const deleteTopicExtension = () => {
      emit("delete", extension.name);
    };

    return {
      extension,
      editTopicExtension,
      submit,
      deleteTopicExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./SettingCardItem.scss"></style>
