<template>
  <div class="maplibre-wrapper" :id="containerID">
    <a class="maptiler-link" href="https://www.maptiler.com/" target="_blank">
      <img src="/static/maptiler-logo.svg" />
    </a>
    <!-- Map will be displayed here -->
  </div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import { MaplibreMap } from "../../../utils/maplibre.js";

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
    onMounted(() => {
      watchEffect(() => {
        // Do not try to load map if container element does not exist
        if (!document.getElementById(props.containerID)) return;

        const center = [props.longitude, props.latitude];
        const map = new MaplibreMap(props.containerID, center);
        map.addMarker(center);
      });
    });
  }
};
</script>

<style src="../../../../node_modules/maplibre-gl/dist/maplibre-gl.css"></style>
<style scoped>
.maplibre-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  filter: grayscale(0.7);

  .maptiler-link {
    position: absolute;
    z-index: 1;
    bottom: calc(var(--spacing-unit) / 4);
    left: calc(var(--spacing-unit) / 2);
    user-select: none;
  }

  &:deep() {
    .maplibregl-canvas {
      outline: none;
    }
    .maplibregl-canvas-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
