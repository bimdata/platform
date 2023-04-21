const AVAILABLE_PLUGINS = Object.freeze({
  bimobject: "https://cdn.jsdelivr.net/npm/@bimdata/bimobject-viewer-plugin@2.0.1",
  gltfExtractor:"https://cdn.jsdelivr.net/npm/@bimdata/gltf-extractor-viewer-plugin@2.0.1",
  idex: "https://cdn.jsdelivr.net/npm/@bimdata/idex-viewer-plugin@1.0.7",
  iot: "https://cdn.jsdelivr.net/npm/@bimdata/iot-viewer-plugin@2.0.0",
  svgExtractor: "https://cdn.jsdelivr.net/npm/@bimdata/svg-extractor-viewer-plugin@2.0.0"
});

/**
 * List of available viewer windows.
 */
const WINDOWS = Object.freeze({
  DWG: "dwg",
  DXF: "dxf",
  IFC2D: "2d",
  IFC3D: "3d",
  PLAN: "plan",
  POINT_CLOUD: "pointCloud"
});

/**
 * Viewer window that will be opened by default
 * if none is specified.
 */
const DEFAULT_WINDOW = WINDOWS.IFC3D;

const PLUGINS_CONFIG = {
  accessMarketplace: true,
  bcfManager: true,
  buildingMaker: true,
  header: {
    warnings: false
  },
  properties: {
    editProperties: true
  },
  split: true,
  structure: {
    export: true,
    merge: true
  },
  "structure-properties": {
    editProperties: true,
    export: true,
    merge: true
  },
  "viewer2d-background": true,
  viewer3d: {
    enableDynamicLOD: true
  }
};

export { AVAILABLE_PLUGINS, DEFAULT_WINDOW, PLUGINS_CONFIG, WINDOWS };
