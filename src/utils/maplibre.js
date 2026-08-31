import maplibregl from "maplibre-gl";

const MAP_TILER_TOKEN = ENV.VUE_APP_MAPTILER_TOKEN;
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_TOKEN}`;
const MAP_DEFAULT_CENTER = [2.294481, 48.858370]; // Tour Eiffel

const MARKER_COLOR = "#2F374A"; // color primary

export class MaplibreMap {
  constructor(containerId, center = MAP_DEFAULT_CENTER) {
    this.map = new maplibregl.Map({
      container: containerId,
      style: MAP_STYLE_URL,
      center,
      zoom: 15.5,
      pitch: 45,
      bearing: 0,
      attributionControl: false,
    });

    const { promise, resolve } = Promise.withResolvers();
    this.isReady = promise;

    this.map.on("load", resolve);
  }

  setCenter(center) {
    this.map.setCenter(center);
  }

  addMarker([longitude, latitude]) {
    const marker = new maplibregl.Marker({ color: MARKER_COLOR });
    marker.setLngLat([longitude, latitude]);

    return this.isReady.then(() => marker.addTo(this.map));
  }
}

export function computeBounds(markers) {
  if (markers.length < 2) {
    console.warn("[computeBounds] We need at least 2 markers to compute map bounds.");
    return;
  }

  markers = markers.map(m => {
    const { lng, lat } = m.getLngLat();
    return [lng, lat];
  });

  let [a0, b0] = markers.pop(), [a1, b1] = markers.pop();
  let sw = [Math.min(a0, a1), Math.min(b0, b1)]; // south-west
  let ne = [Math.max(a0, a1), Math.max(b0, b1)]; // north-east

  while (markers.length > 0) {
    let [lng, lat] = markers.pop();
    if (lng < sw[0]) sw[0] = lng;
    if (lat < sw[1]) sw[1] = lat;
    if (lng > ne[0]) ne[0] = lng;
    if (lat > ne[1]) ne[1] = lat;
  }

  return [sw, ne];
}
