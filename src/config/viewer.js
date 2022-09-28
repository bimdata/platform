import { MODEL_TYPE } from "./models.js";

const { DWG, DXF, IFC, JPEG, JPG, META_BUILDING, PDF, PNG } = MODEL_TYPE;

const AVAILABLE_PLUGINS = Object.freeze({
  backgroundColor:
    "https://unpkg.com/@bimdata/background-color-viewer-plugin@1.0.1",
  bimobject: "https://unpkg.com/@bimdata/bimobject-viewer-plugin@1.0.2",
  gltfExtractor:
    "https://unpkg.com/@bimdata/gltf-extractor-viewer-plugin@1.0.2",
  idex: "https://unpkg.com/@bimdata/idex-viewer-plugin@1.0.7",
  iot: "https://unpkg.com/@bimdata/iot-viewer-plugin@1.0.10",
  realiz3D: "https://unpkg.com/@bimdata/realiz3d-viewer-plugin@0.0.2",
  svgExtractor: "https://unpkg.com/@bimdata/svg-extractor-viewer-plugin@1.0.2"
});

const WINDOWS = Object.freeze({
  DWG: "dwg",
  DXF: "dxf",
  PLAN: "plan",
  V2D: "2d",
  V3D: "3d"
});

/**
 * Define the type of models that can opened
 * in each viewer window
 */
const WINDOW_MODELS = Object.freeze({
  [WINDOWS.DWG]: [DWG],
  [WINDOWS.DXF]: [DXF],
  [WINDOWS.PLAN]: [JPEG, JPG, META_BUILDING, PDF, PNG],
  [WINDOWS.V2D]: [IFC],
  [WINDOWS.V3D]: [IFC]
});

const DEFAULT_WINDOW = WINDOWS.V3D;

const PLUGINS_CONFIG = {
  header: {
    warnings: false
  },
  measure3d: true,
  split: true,
  "structure-properties": {
    merge: true,
    export: true,
    editProperties: true
  },
  structure: {
    merge: true,
    export: true
  },
  properties: {
    editProperties: true
  },
  "viewer2d-background": true,
  plan: true,
  buildingMaker: true,
  viewer3d: {
    enableDynamicLOD: true
  },
  bcfManager: true,
  accessMarketplace: true
};

export {
  AVAILABLE_PLUGINS,
  DEFAULT_WINDOW,
  PLUGINS_CONFIG,
  WINDOW_MODELS,
  WINDOWS
};
