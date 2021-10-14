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
        loading="lazy"
        :src="image.url || '/static/default-model-preview.png'"
        :style="{ transform: `translateX(-${translation}px)` }"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";

export default {
  props: {
    models: {
      type: Array,
      required: true
    }
  },
  emis: ["preview-changed"],
  setup(props, { emit }) {
    const nbSlices = 15;
    const container = ref(null);
    const viewport = ref(null);

    const translation = ref(0);
    const translate = event => {
      if (container.value && viewport.value) {
        const c = container.value.getBoundingClientRect();
        const v = viewport.value.getBoundingClientRect();
        let i = Math.abs(
          Math.ceil(nbSlices * (1 - (event.clientX - c.x) / c.width))
        );
        i = Math.min(i, nbSlices);
        translation.value = (i - 1) * v.width;
      }
    };

    const images = ref([]);
    const image = ref({});
    const index = ref(0);

    const previousImage = () => {
      if (index.value > 0) index.value--;
    };
    const nextImage = () => {
      if (index.value < images.value.length - 1) index.value++;
    };

    watch(
      () => props.models,
      () => {
        images.value = props.models.map((model, i) => ({
          index: i + 1,
          url: model.viewer360File
        }));
        image.value = images.value.length > 0 ? images.value[0] : {};
        index.value = 0;
      },
      { immediate: true }
    );
    watch(index, i => {
      image.value = images.value[i] || {};
      emit("preview-changed", props.models[i]);
    });

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
