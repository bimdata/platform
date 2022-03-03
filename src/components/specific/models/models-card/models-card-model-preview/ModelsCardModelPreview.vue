<template>
  <div class="models-card-model-preview">
    <div class="models-card-model-preview__index" v-if="images.length > 1">
      {{ `${image.index} / ${images.length}` }}
    </div>

    <div
      class="models-card-model-preview__container"
      ref="container"
      @mousemove="handleMouseMove"
    >
      <div
        v-if="image && image.url"
        class="models-card-model-preview__container__viewport"
        ref="viewport"
      >
        <img
          :src="image.url"
          :style="{ transform: `translateX(-${translation}px)` }"
        />
      </div>
      <div v-else class="models-card-model-preview__container__empty-preview">
        {{ $t("ModelsCardModelPreview.emptyPreviewPlaceholder") }}
      </div>
    </div>

    <div class="models-card-model-preview__switcher" v-if="images.length > 0">
      <div class="models-card-model-preview__switcher__text">
        <BIMDataTextbox :text="image.name" tooltipPosition="top" />
      </div>
      <template v-if="images.length > 1">
        <BIMDataButton
          class="models-card-model-preview__switcher__btn-previous"
          ghost
          rounded
          icon
          :disabled="image.index === 1"
          @click="previousImage"
        >
          <BIMDataIcon name="chevron" size="xxs" :rotate="180" />
        </BIMDataButton>
        <BIMDataButton
          class="models-card-model-preview__switcher__btn-next"
          ghost
          rounded
          icon
          :disabled="image.index === images.length"
          @click="nextImage"
        >
          <BIMDataIcon name="chevron" size="xxs" />
        </BIMDataButton>
      </template>
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
  emits: ["model-changed"],
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
          Math.ceil(nbSlices * (1 - (event.clientX - containerRect.x) / containerRect.width))
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
        emit("model-changed", props.models[newIndex]);
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
            url: model.viewer360File
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

<style scoped lang="scss" src="./ModelsCardModelPreview.scss"></style>
