<template>
  <div
    class="project-card-model-preview"
    ref="container"
    @mousemove="handleMouseMove"
  >
    <div
      v-if="images.length > 1"
      class="project-card-model-preview__switcher"
      @click.prevent.stop="() => {}"
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
import { ref, watch } from "vue";

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
    const handleMouseMove = event => {
      if (container.value && viewport.value) {
        const containerRect = container.value.getBoundingClientRect();
        const viewportRect = viewport.value.getBoundingClientRect();
        let offset = Math.abs(
          Math.ceil(
            nbSlices *
              (1 - (event.clientX - containerRect.x) / containerRect.width)
          )
        );
        offset = Math.min(offset, nbSlices);
        translation.value = (offset - 1) * viewportRect.width;
      }
    };

    const images = ref([]);
    const image = ref({});
    const index = ref(0);

    const previousImage = () => {
      // Can't go below 0
      if (index.value > 0) index.value--;
    };
    const nextImage = () => {
      // Can't go above max length
      if (index.value < images.value.length - 1) index.value++;
    };

    watch(index, (newIndex, oldIndex) => {
      if (newIndex !== oldIndex) {
        image.value = images.value[newIndex] || {};
        emit("preview-changed", props.models[newIndex]);
      }
    });

    watch(
      () => props.models,
      () => {
        images.value = props.models
          .filter(model => !model.archived)
          .map((model, i) => ({
            index: i + 1,
            name: model.name,
            url: model.viewer_360_file
          }));
        image.value = images.value.length > 0 ? images.value[0] : {};
        index.value = 0;
      },
      { immediate: true }
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
      handleMouseMove
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardModelPreview.scss"></style>
