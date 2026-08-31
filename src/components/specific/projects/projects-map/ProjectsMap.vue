<template>
  <div class="projects-map" :id="CONTAINER_ID">
    <!-- Map will be displayed here -->
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useModels } from "../../../../state/models.js";
import routeNames from "../../../../router/route-names.js";
import { debounce } from "../../../../utils/async.js";
import { computeBounds, MaplibreMap } from "../../../../utils/maplibre.js";
import { DMS2DD } from "../../../../utils/location.js";

const router = useRouter();
const { fetchModelLocation } = useModels();

const CONTAINER_ID = "projects-map";

let map = null, markers;

const setMapCamera = debounce(() => {
  if (markers.size === 0) {
    return;
  }
  if (markers.size === 1) {
    const marker = markers.values().next().value;
    const center = marker.getLngLat();
    map.setCenter(center);
    return;
  }

  const bounds = computeBounds([...markers.values()]);
  if (bounds) map.map.fitBounds(bounds, { animate: false });
}, 600);

const addProject = async project => {
  if (!map) return;

  for (const model of project.models) {
    const location = await fetchModelLocation(project, model);
    const { longitude, latitude } = location;

    if (longitude && latitude) {
      const position = [DMS2DD(longitude, "longitude"), DMS2DD(latitude, "latitude")];
      const marker = await map.addMarker(position);
      marker.on("click", () =>
        router.push({
          name: routeNames.projectBoard,
          params: {
            spaceID: model.project.cloud.id,
            projectID: model.project.id,
          }
        })
      );

      markers.set(project.id, marker);
      break;
    }
  }

  setMapCamera();
};

defineExpose({ addProject });

onMounted(() => {
  map = new MaplibreMap(CONTAINER_ID);
  markers = new Map();
});

onBeforeUnmount(() => {
  markers?.clear();
  map?.map.remove();
});
</script>

<style src="../../../../../node_modules/maplibre-gl/dist/maplibre-gl.css"></style>
<style scoped>
.projects-map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
