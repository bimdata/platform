<template>
  <div class="maplibre-wrapper" :id="containerID">
    <a class="maptiler-link" href="https://www.maptiler.com/" target="_blank">
      <img src="/static/maptiler-logo.svg" />
    </a>
    <!-- Maplibre map will be injected here -->
  </div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import { useMaplibre } from "../../../composables/maplibre.js";

export default {
  props: {
    containerID: {
      type: String,
      default: "maplibre-container"
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const { loadMap } = useMaplibre(props.containerID);

    onMounted(() => {
      watchEffect(() => {
        loadMap(props.longitude, props.latitude);
      });
    });
  }
};
</script>

<style src="../../../../node_modules/maplibre-gl/dist/maplibre-gl.css"></style>
<style scoped lang="scss" src="./MaplibreWrapper.scss"></style>
