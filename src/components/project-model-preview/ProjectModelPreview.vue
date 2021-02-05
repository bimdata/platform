<template>
  <div class="project-model-preview" ref="container" @mousemove="translate">
    <div class="project-model-preview__wrapper" ref="viewport">
      <img
        :src="image || '/static/default-model-preview.png'"
        :style="{ transform: `translateX(-${translation}px)` }"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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
    const container = ref(null);
    const viewport = ref(null);

    const translation = ref(0);
    const translate = event => {
      if (container.value && viewport.value) {
        const c = container.value.getBoundingClientRect();
        const v = viewport.value.getBoundingClientRect();
        let index = Math.abs(
          Math.ceil(nbSlices * (1 - (event.clientX - c.x) / c.width))
        );
        index = Math.min(index, nbSlices);
        translation.value = (index - 1) * v.width;
      }
    };

    const image = ref(null);
    fetchProjectPreviewImage(props.project).then(
      imageURL => (image.value = imageURL)
    );

    return {
      // References
      container,
      image,
      translation,
      viewport,
      // Methods
      translate
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelPreview.scss"></style>
