<template>
  <div class="project-model-preview">
    <div
      class="project-model-preview__wrapper"
      ref="previewWrapper"
      @mousemove="translate"
    >
      <img
        :style="{ transform: `translateX(-${translation}px)` }"
        src="@/assets/default-model-preview.png"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    const nbSlices = 15;

    const previewWrapper = ref(null);

    const translation = ref(0);
    const translate = event => {
      if (previewWrapper.value) {
        const wrapper = previewWrapper.value.getBoundingClientRect();
        let index = Math.abs(
          Math.ceil(
            nbSlices * (1 - (event.clientX - wrapper.x) / wrapper.width)
          )
        );
        index = Math.min(index, nbSlices);
        translation.value = (index - 1) * wrapper.width;
      }
    };

    return {
      // References
      previewWrapper,
      translation,
      // Methods
      translate
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelPreview.scss"></style>
