import maplibregl from "maplibre-gl";

const MAP_TILER_TOKEN = import.meta.env.VUE_APP_MAPTILER_TOKEN;

export function useMaplibre(containerID) {
  const loadMap = (longitude, latitude) => {
    if (!document.getElementById(containerID)) {
      // Do not try to load map if container element does not exist
      return;
    }

    if (longitude && latitude) {
      try {
        const map = new maplibregl.Map({
          container: containerID,
          style: `https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_TOKEN}`,
          center: [longitude, latitude],
          zoom: 15.5,
          pitch: 45,
          bearing: -17.6,
          attributionControl: false,
          antialias: true
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
              source: "openmaptiles",
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

          new maplibregl.Marker({ color: "#2F374A" /* color primary */ })
            .setLngLat([longitude, latitude])
            .addTo(map);
        });
      } catch (error) {
        console.warn(error);
      }
    }
  };

  return {
    loadMap
  };
}
