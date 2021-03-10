<template>
  <div class="viewer-card-model-preview">
    <div class="viewer-card-model-preview__index" v-if="images.length > 1">
      {{ `${image.index} / ${images.length}` }}
    </div>

    <div
      class="viewer-card-model-preview__container"
      ref="container"
      @mousemove="translate"
    >
      <div
        v-if="image && image.url"
        class="viewer-card-model-preview__container__viewport"
        ref="viewport"
      >
        <img
          :src="image.url"
          :style="{ transform: `translateX(-${translation}px)` }"
        />
      </div>
      <div class="viewer-card-model-preview__container__no-preview">
        {{ $t("ViewerCardModelPreview.noPreview") }}
      </div>
    </div>

    <div class="viewer-card-model-preview__switcher" v-if="images.length > 0">
      <span>{{ image.name }}</span>
      <template v-if="images.length > 1">
        <BIMDataButton
          class="viewer-card-model-preview__switcher__btn-previous"
          ghost
          rounded
          icon
          :disabled="image.index === 1"
          @click="previousImage"
        >
          <BIMDataIcon name="chevron" size="xxs" :rotate="180" />
        </BIMDataButton>
        <BIMDataButton
          class="viewer-card-model-preview__switcher__btn-next"
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
import { ref, watchEffect } from "vue";
import { useModels } from "@/state/models";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { projectModels } = useModels();

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
    watchEffect(() => {
      images.value = projectModels.value.map((model, i) => ({
        index: i + 1,
        name: model.name,
        url: model.viewer360File
      }));
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

<style scoped lang="scss" src="./ViewerCardModelPreview.scss"></style>
