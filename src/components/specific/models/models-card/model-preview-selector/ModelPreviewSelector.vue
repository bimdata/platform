<script setup>
import { ref, watch } from "vue";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useProjects } from "../../../../../state/projects.js";

const { IFC, POINT_CLOUD } = MODEL_TYPE;
const { updateProject } = useProjects();

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  models: {
    type: Array,
    required: true
  },
  onCancel: {
    type: Function
  },
  onSuccess: {
    type: Function
  },
  onError: {
    type: Function
  }
});

const selectedModel = ref(null);

watch(
  () => props.models,
  () => {
    selectedModel.value =
      props.models.find(m => m.id === props.project.main_model_id) ??
      props.models[0];
  },
  { immediate: true }
);

const cancel = () => {
  props.onCancel?.();
};

const submit = async () => {
  try {
    await updateProject({
      ...props.project,
      main_model_id: selectedModel.value.id
    });
    props.onSuccess?.();
  } catch (error) {
    props.onError?.(error);
  }
};
</script>

<template>
  <div class="model-preview-selector">
    <div class="model-preview-selector__head">
      <h3>{{ $t("ModelPreviewSelector.title") }}</h3>
    </div>
    <div class="model-preview-selector__body">
      <BIMDataResponsiveGrid itemWidth="215px">
        <div
          class="model-preview-item"
          :class="{ selected: selectedModel?.id === model.id }"
          v-for="model of models"
          :key="model.id"
          @click="selectedModel = model"
        >
          <BIMDataRadio v-model="selectedModel" :value="model" big />
          <div
            class="model-preview-item__img"
            :style="{
              'justify-content': [IFC, POINT_CLOUD].includes(model.type)
                ? 'start'
                : 'center'
            }"
          >
            <img :src="model.preview_file" />
          </div>
          <div class="model-preview-item__txt">
            <BIMDataTextbox :text="model.name" />
          </div>
        </div>
      </BIMDataResponsiveGrid>
    </div>
    <div class="model-preview-selector__foot">
      <BIMDataButton width="120px" color="high" outline radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton width="120px" color="primary" fill radius @click="submit">
        {{ $t("t.validate") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./ModelPreviewSelector.scss"></style>
