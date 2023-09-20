<template>
  <div class="models-card-model-preview">
    <div v-if="images.length > 1" class="models-card-model-preview__head">
      <div class="models-card-model-preview__head__index">
        {{ `${image.index} / ${images.length}` }}
      </div>
      <div class="models-card-model-preview__head__menu">
        <BIMDataButton
          v-if="project.isAdmin"
          data-test-id="btn-actions-cell"
          class="file-actions-cell__btn"
          ripple
          rounded
          icon
          @click="isOpenMenu = !isOpenMenu"
        >
          <BIMDataIconEllipsis size="l" />
        </BIMDataButton>

        <BIMDataMenu
          v-show="isOpenMenu"
          :menuItems="[
            {
              key: 1,
              text: 'Select preview',
              action: openPreviewSelector
            }
          ]"
        >
          <template #item="{ item }">
            <span>{{ item.text }}</span>
          </template>
        </BIMDataMenu>
      </div>
    </div>
    <template v-if="image.url">
      <BIMDataModelPreview
        class="models-card-model-preview__viewer"
        :type="image.type === MODEL_TYPE.IFC ? '3d' : '2d'"
        :previewUrl="image.url"
        :width="377"
        :height="342"
        backgroundColor="var(--color-silver)"
      />
      <BIMDataIcon
        class="models-card-model-preview__icon"
        :name="MODEL_CONFIG[image.type].icon"
        size="l"
      />
    </template>
    <template v-else>
      <div class="models-card-model-preview__placeholder">
        <BIMDataIcon :name="MODEL_CONFIG[image.type].icon" customSize="150" />
      </div>
    </template>

    <div class="models-card-model-preview__switcher" v-if="images.length > 0">
      <div class="models-card-model-preview__switcher__text">
        <BIMDataTextbox :text="image.name" tooltipPosition="top" />
      </div>
      <template v-if="images.length > 1">
        <BIMDataButton
          class="models-card-model-preview__switcher__btn-prev"
          ghost
          rounded
          icon
          :disabled="image.index === 1"
          @click="prevImage"
        >
          <BIMDataIconChevron size="xxs" :rotate="180" />
        </BIMDataButton>
        <BIMDataButton
          class="models-card-model-preview__switcher__btn-next"
          ghost
          rounded
          icon
          :disabled="image.index === images.length"
          @click="nextImage"
        >
          <BIMDataIconChevron size="xxs" />
        </BIMDataButton>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_CONFIG, MODEL_TYPE } from "../../../../../config/models.js";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
// Components
import MainModelSelector from "../main-model-selector/MainModelSelector.vue";

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
  emits: ["model-changed"],
  setup(props, { emit }) {
    const { openModal, closeModal } = useAppModal();

    const container = ref(null);
    const viewport = ref(null);
    const isOpenMenu = ref(false);

    const images = ref([]);
    const image = ref({});
    const index = ref(0);

    const prevImage = () => {
      // Can't go below 0
      if (index.value > 0) index.value--;
    };
    const nextImage = () => {
      // Can't go above max length
      if (index.value < images.value.length - 1) index.value++;
    };

    const openPreviewSelector = () => {
      isOpenMenu.value = false;
      openModal({
        component: MainModelSelector,
        props: {
          project: props.project,
          models: props.models,
          onCancel: closeModal,
          onSuccess: closeModal
        }
      });
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
          name: model.name,
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
      isOpenMenu,
      MODEL_CONFIG,
      MODEL_TYPE,
      viewport,
      // Methods
      nextImage,
      prevImage,
      openPreviewSelector
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsCardModelPreview.scss"></style>
