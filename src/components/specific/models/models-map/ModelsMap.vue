<template>
  <div class="models-map" :id="CONTAINER_ID">
    <!-- Map will be displayed here -->
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useModels } from "../../../../state/models.js";
import { computeBounds, MaplibreMap } from "../../../../utils/maplibre.js";
import { DMS2DD } from "../../../../utils/location.js";
import { openInViewer } from "../../../../utils/models.js";

const router = useRouter();
const { fetchModelLocation } = useModels();

const CONTAINER_ID = "models-map";

const props = defineProps({
  models: {
    type: Array,
    default: () => [],
  },
});

const loadedModelIds = new Set();
const markers = new Map();

onMounted(() => {
  const map = new MaplibreMap(CONTAINER_ID);

  watch(
    () => props.models,
    async models => {
      const ids = new Set(models.map(m => m.id));
      const modelIdsToLoad = ids.difference(loadedModelIds);
      const modelIdsToUnload = loadedModelIds.difference(ids);

      await Promise.all(
        models.map(async model => {
          if (modelIdsToLoad.has(model.id)) {
            const location = await fetchModelLocation(model.project, model);
            const { longitude, latitude } = location;

            if (longitude && latitude) {
              const position = [DMS2DD(longitude, "longitude"), DMS2DD(latitude, "latitude")];
              const marker = await map.addMarker(position);
              marker.on("click", () => openInViewer(router, model.project, model));

              markers.set(model.id, marker);
            }

            loadedModelIds.add(model.id);
          }

          if (modelIdsToUnload.has(model.id)) {
            // TODO: remove marker from map

            loadedModelIds.delete(model.id);
          }
        })
      );

      // Set map camera
      if (markers.length === 0) {
        return;
      }
      if (markers.length === 1) {
        map.setCenter(markers[0]);
        return;
      }

      const bounds = computeBounds([...markers.values()]);
      if (bounds) map.map.fitBounds(bounds, { animate: false });
    },
    { immediate: true }
  );
});

onBeforeUnmount(() => {
  loadedModelIds.clear();
  markers.clear();
});
</script>

<style src="../../../../../node_modules/maplibre-gl/dist/maplibre-gl.css"></style>
<style scoped>
.models-map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
