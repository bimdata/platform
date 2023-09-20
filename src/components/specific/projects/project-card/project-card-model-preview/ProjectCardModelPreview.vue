<template>
  <div class="project-card-model-preview">
    <div
      v-if="images.length > 1"
      class="project-card-model-preview__switcher"
      @click.prevent.stop="() => {}"
    >
      <BIMDataIconChevron size="xs" :rotate="180" @click="previousImage" />
      <span>{{ `${image.index} / ${images.length}` }}</span>
      <BIMDataIconChevron size="xs" @click="nextImage" />
    </div>
    <BIMDataModelPreview
      :type="!image.url || image.type === MODEL_TYPE.IFC ? '3d' : '2d'"
      :previewUrl="image.url"
      defaultUrl="/static/default-model-preview.png"
      :width="320"
      :height="205"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_TYPE } from "../../../../../config/models.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  },
  emis: ["model-changed"],
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
        images.value = props.models.map((model, i) => ({
          index: i + 1,
          type: model.type,
          url: model.preview_file
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
      MODEL_TYPE,
      viewport,
      // Methods
      nextImage,
      previousImage
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardModelPreview.scss"></style>
