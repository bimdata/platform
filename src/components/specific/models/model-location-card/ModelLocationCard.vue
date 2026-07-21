<template>
  <section class="model-location-card">
    <header class="model-location-card__header">
      <BIMDataIconLocation size="xs" color="primary" />
      <span class="model-location-card__header__title">
        {{ $t("ModelLocation.title") }}
      </span>
    </header>
    <div class="model-location-card__body">
      <ModelLocation :project="project" :model="model" />
    </div>
  </section>
</template>

<script>
// Components
import ModelLocation from "../model-location/ModelLocation.vue";

export default {
  components: {
    ModelLocation,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss" src="./ModelLocationCard.scss"></style>
