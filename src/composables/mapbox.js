import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapbox(containerID) {
  const loadMap = (longitude, latitude) => {
    if (!document.getElementById(containerID)) {
      // Do not try to load map if container element does not exist
      return;
    }

    if (longitude && latitude) {
      try {
        const map = new mapboxgl.Map({
          container: containerID,
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

          new mapboxgl.Marker({ color: "#2F374A" /* color primary */ })
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
