<template>
  <div class="main-model-selector">
    <div v-if="loading" class="main-model-selector__loading">
      <BIMDataSpinner />
    </div>

    <div class="main-model-selector__head">
      <h3>{{ $t("MainModelSelector.title") }}</h3>
    </div>
    <div class="main-model-selector__body">
      <BIMDataResponsiveGrid itemWidth="215px">
        <div
          class="model-item"
          :class="{ selected: selectedModel?.id === model.id }"
          v-for="model of models"
          :key="model.id"
          @click="selectedModel = model"
        >
          <BIMDataRadio v-model="selectedModel" :value="model" big />
          <div
            class="model-item__img"
            :style="{
              'justify-content': [IFC, POINT_CLOUD].includes(model.type)
                ? 'start'
                : 'center'
            }"
          >
            <img :src="model.preview_file" />
          </div>
          <div class="model-item__txt">
            <BIMDataTextbox :text="model.name" />
          </div>
        </div>
      </BIMDataResponsiveGrid>
    </div>
    <div class="main-model-selector__foot">
      <BIMDataButton width="120px" color="high" outline radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        :disabled="!selectedModel || selectedModel?.id === mainModel?.id"
        @click="submit"
      >
        {{ $t("t.validate") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_TYPE } from "../../../../../config/models.js";
import { useModels } from "../../../../../state/models.js";
import { useProjects } from "../../../../../state/projects.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    },
    onCancel: {
      type: Function,
      required: true
    },
    onSuccess: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const { IFC, POINT_CLOUD } = MODEL_TYPE;
    const { updateProject } = useProjects();
    const { loadProjectModels } = useModels();

    const loading = ref(false);
    const mainModel = ref(null);
    const selectedModel = ref(null);

    watch(
      () => props.models,
      () => {
        mainModel.value = props.models.find(
          m => m.id === props.project.main_model_id
        );
        selectedModel.value = mainModel.value ?? props.models[0];
      },
      { immediate: true }
    );

    const cancel = () => {
      props.onCancel();
    };

    const submit = async () => {
      try {
        loading.value = true;
        const updatedProject = await updateProject({
          ...props.project,
          main_model_id: selectedModel.value.id
        });
        await loadProjectModels(updatedProject);
        props.onSuccess();
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      // References
      loading,
      mainModel,
      selectedModel,
      IFC,
      POINT_CLOUD,
      // Methods
      cancel,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./MainModelSelector.scss"></style>
