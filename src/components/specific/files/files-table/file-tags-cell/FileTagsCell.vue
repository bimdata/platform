<template>
  <div class="file-tags-cell">
    {{ console.log("file", file) }}
    <template v-for="tag in file.tags">{{ tag.name }}</template>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      console
    };
  }
};
</script>
