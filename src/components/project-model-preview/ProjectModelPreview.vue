<template>
  <div class="project-model-preview">
    <div
      class="project-model-preview__wrapper"
      ref="previewWrapper"
      @mousemove="translate"
    >
      <img
        :src="image || '/static/default-model-preview.png'"
        :style="{ transform: `translateX(-${translation}px)` }"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useProjects } from "@/state/projects";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { fetchProjectPreviewImage } = useProjects();

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

    const image = ref(null);
    onMounted(() => {
      fetchProjectPreviewImage(props.project).then(
        imageURL => (image.value = imageURL)
      );
    });

    return {
      // References
      image,
      previewWrapper,
      translation,
      // Methods
      translate
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelPreview.scss"></style>
