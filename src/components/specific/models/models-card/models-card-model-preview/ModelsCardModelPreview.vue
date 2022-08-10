<template>
  <div class="models-card-model-preview">
    <div class="models-card-model-preview__index" v-if="images.length > 1">
      {{ `${image.index} / ${images.length}` }}
    </div>

    <BIMDataModelPreview
      v-if="image && image.url"
      :previewUrl="image.url"
      :width="377"
      :height="342"
      backgroundColor="var(--color-silver)"
    />
    <div v-else class="models-card-model-preview__placeholder">
      {{ $t("ModelsCardModelPreview.emptyPreviewPlaceholder") }}
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
    const container = ref(null);
    const viewport = ref(null);

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
            url: model.viewer_360_file
          }));

        index.value = 0;
        image.value = images.value.length > 0 ? images.value[0] : {};
        emit("model-changed", props.models[index.value]);
      },
      { immediate: true }
    );

    return {
      // References
      container,
      image,
      images,
      viewport,
      // Methods
      nextImage,
      previousImage
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsCardModelPreview.scss"></style>
