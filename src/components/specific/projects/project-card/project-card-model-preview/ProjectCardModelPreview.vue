<template>
  <div class="project-card-model-preview">
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
import { MODEL_TYPE } from "@/config/models.js";

export default {
  props: {
    models: {
      type: Array,
      required: true
    }
  },
  emis: ["preview-changed"],
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
            type: model.type,
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
      viewport,
      MODEL_TYPE,
      // Methods
      nextImage,
      previousImage
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardModelPreview.scss"></style>
