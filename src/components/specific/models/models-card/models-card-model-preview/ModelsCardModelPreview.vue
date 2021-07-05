<template>
  <div class="models-card-model-preview">
    <div class="models-card-model-preview__index" v-if="images.length > 1">
      {{ `${image.index} / ${images.length}` }}
    </div>

    <div
      class="models-card-model-preview__container"
      ref="container"
      @mousemove="translate"
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
      <TextBox :text="image.name" :maxLength="44" />
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
    const image = ref(null);
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
          name: model.name,
          url: model.viewer360File
        }));
        image.value = images.value.length > 0 ? images.value[0] : null;
        index.value = 0;
      },
      { immediate: true }
    );
    watch(index, (newIndex, oldIndex) => {
      if (newIndex !== oldIndex) {
        image.value = images.value[newIndex] || null;
        emit("model-changed", props.models[newIndex]);
      }
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

<style scoped lang="scss" src="./ModelsCardModelPreview.scss"></style>
