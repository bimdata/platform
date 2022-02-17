<template>
  <div class="tag-input bimdata-input">
    <input
      v-model="newTag"
      type="text"
      @keydown.enter="addTag(newTag)"
      @keydown.prevent.tab="addTag(newTag)"
      @keydown.delete="newTag.length || removeTag(tags.length - 1)"
    />
    <label for="bimdata-input">
      {{ $t("CreateBcfTopic.tagsPlaceholder") }}
    </label>
    <span class="bar"></span>
    <ul class="tags bimdata-list m-t-6">
      <li
        v-for="(tag, index) in tags"
        :key="tag"
        class="tag flex items-center p-6"
      >
        <span class="m-r-6">{{ tag }}</span>
        <BIMDataIcon
          name="close"
          fill
          color="granite"
          size="xxxs"
          @click="removeTag(index)"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    modelValue: { type: Array, default: () => [] }
  },
  setup(props, { emit }) {
    const tags = ref(props.modelValue);
    const newTag = ref("");
    const addTag = tag => {
      tags.value.push(tag);
      newTag.value = "";
    };
    const removeTag = index => {
      tags.value.splice(index, 1);
    };
    const onTagsChange = () => {
      emit("update:modelValue", tags.value);
      tags.value = [];
      console.log(tags.value);
    };
    return { tags, newTag, addTag, removeTag, onTagsChange };
  }
};
</script>
<style scoped lang="scss" src="./TagsInput.scss"></style>
