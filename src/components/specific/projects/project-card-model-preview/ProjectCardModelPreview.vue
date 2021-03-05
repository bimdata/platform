<template>
  <div
    class="project-card-model-preview"
    ref="container"
    @mousemove="translate"
  >
    <div
      v-if="images.length > 1"
      class="project-card-model-preview__switcher"
      @click.stop="() => {}"
    >
      <BIMDataIcon
        name="chevron"
        size="xs"
        :rotate="180"
        @click="previousImage"
      />
      <span>{{ `${image.index} / ${images.length}` }}</span>
      <BIMDataIcon name="chevron" size="xs" @click="nextImage" />
    </div>
    <div class="project-card-model-preview__viewport" ref="viewport">
      <img
        :src="image ? image.url : '/static/default-model-preview.png'"
        :style="{ transform: `translateX(-${translation}px)` }"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useProjects } from "@/state/projects";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { fetchProjectPreviewImages } = useProjects();

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

    let index = 0;
    const image = ref(null);
    const images = ref([]);
    const nextImage = () => {
      if (index < images.value.length - 1) {
        image.value = images.value[++index];
      }
    };
    const previousImage = () => {
      if (index > 0) {
        image.value = images.value[--index];
      }
    };
    watchEffect(
      () => (image.value = images.value.length > 0 ? images.value[0] : null)
    );
    fetchProjectPreviewImages(props.project).then(
      urls => (images.value = urls.map((url, i) => ({ index: i + 1, url })))
    );

    return {
      // References
      container,
      image,
      images,
      translation,
      viewport,
      // Methods
      nextImage,
      previousImage,
      translate
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardModelPreview.scss"></style>
