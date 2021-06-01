<template>
  <img
    class="file-icon"
    :width="size"
    :height="(+size * 4) / 3"
    :src="imageUrl"
    @error="imageUrl = '/static/file-icons/unknown.svg'"
  />
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    name: {
      type: String
    },
    size: {
      type: [String, Number],
      default: "16"
    }
  },
  setup(props) {
    const imageUrl = ref("");

    watch(
      () => props.name,
      name => (imageUrl.value = `/static/file-icons/${name || "unknown"}.svg`),
      { immediate: true }
    );

    return {
      imageUrl
    };
  }
};
</script>
