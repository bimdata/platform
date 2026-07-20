<template>
  <section class="models-overview">
    <header class="models-overview__header">
      <BIMDataIconIfcFile size="xs" color="primary" />
      <span class="models-overview__header__title">
        {{ $t("ModelsOverview.title") }}
      </span>
    </header>
    <div class="models-overview__body">
      <template v-if="models.length > 0">
        <ModelsCard :project="project" :models="models" @model-changed="onModelChange" />
      </template>
      <template v-else>
        <ModelsOverviewOnboarding @open-file-uploader="$emit('open-file-uploader')" />
      </template>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";
// Components
import ModelsCard from "../models-card/ModelsCard.vue";
import ModelsOverviewOnboarding from "./models-overview-onboarding/ModelsOverviewOnboarding.vue";

export default {
  components: {
    ModelsCard,
    ModelsOverviewOnboarding,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
  },
  emits: ["model-changed", "open-file-uploader"],
  setup(props, { emit }) {
    const currentModel = ref(null);

    const onModelChange = (model) => {
      if (!currentModel.value || currentModel.value.id !== model.id) {
        currentModel.value = model;
        emit("model-changed", model);
      }
    };

    watch(
      () => props.models,
      () => {
        currentModel.value = props.models[0];
        if (currentModel.value) {
          emit("model-changed", currentModel.value);
        }
      },
      { immediate: true },
    );

    return {
      currentModel,
      onModelChange,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelsOverview.scss"></style>
