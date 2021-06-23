<template>
  <div id="mapbox-container" class="mapbox-wrapper">
    <!-- Mapbox will be displayed here -->
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { onMounted, watchEffect } from "vue";

const CONTAINER_ID = "mapbox-container";

export default {
  props: {
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
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

    const loadMap = (longitude, latitude) => {
      const container = document.getElementById(CONTAINER_ID);
      if (container && longitude && latitude) {
        const map = new mapboxgl.Map({
          container: CONTAINER_ID,
          style: "mapbox://styles/mapbox/light-v10",
          center: [longitude, latitude],
          zoom: 15.5,
          pitch: 45,
          bearing: -17.6,
          attributionControl: false
        });

        map.on("load", () => {
          const labelsLayer = map
            .getStyle()
            .layers.find(
              layer => layer.type === "symbol" && layer.layout["text-field"]
            );

          map.addLayer(
            {
              type: "fill-extrusion",
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-opacity": 0.6,
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "height"]
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "min_height"]
                ]
              }
            },
            labelsLayer ? labelsLayer.id : undefined
          );
        });

        new mapboxgl.Marker({ color: "#2F374A" /* color primary */ })
          .setLngLat([longitude, latitude])
          .addTo(map);
      }
    };

    onMounted(() => {
      watchEffect(() => {
        loadMap(props.longitude, props.latitude);
      });
    });
  }
};
</script>

<style scoped lang="scss" src="./MapboxWrapper.scss"></style>
