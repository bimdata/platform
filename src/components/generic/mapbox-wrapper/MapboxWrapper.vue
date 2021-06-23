<template>
  <div class="mapbox-wrapper" :id="containerID">
    <!-- Mapbox will be displayed here -->
  </div>
</template>

<script>
import { onMounted, watchEffect } from "vue";
import { useMapbox } from "@/composables/mapbox";

export default {
  props: {
    containerID: {
      type: String,
      default: "mapbox-container"
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
    const { loadMap } = useMapbox(props.containerID);

    onMounted(() => {
      watchEffect(() => {
        loadMap(props.longitude, props.latitude);
      });
    });
  }
};
</script>

<style scoped lang="scss" src="./MapboxWrapper.scss"></style>
