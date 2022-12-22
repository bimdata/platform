import { MODEL_TYPE } from "./models.js";

const { DWG, DXF, IFC, JPEG, META_BUILDING, PDF, PNG, POINT_CLOUD } =
  MODEL_TYPE;

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

/**
 * List of available viewer windows.
 */
const WINDOWS = Object.freeze({
  DWG: "dwg",
  DXF: "dxf",
  IFC2D: "2d",
  IFC3D: "3d",
  PLAN: "plan",
  TILESET: "pointCloud"
});

/**
 * Define the type of models that can be opened
 * in each viewer window.
 */
const WINDOW_MODELS = Object.freeze({
  [WINDOWS.DWG]: [DWG],
  [WINDOWS.DXF]: [DXF],
  [WINDOWS.IFC2D]: [IFC],
  [WINDOWS.IFC3D]: [IFC],
  [WINDOWS.PLAN]: [JPEG, META_BUILDING, PDF, PNG],
  [WINDOWS.TILESET]: [POINT_CLOUD]
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
  measure3d: true,
  plan: true,
  properties: {
    editProperties: true
  },
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
  tileset: true,
  "tileset-viewer-parameters": true,
  "viewer2d-background": true,
  viewer3d: {
    enableDynamicLOD: true
  }
};

export {
  AVAILABLE_PLUGINS,
  DEFAULT_WINDOW,
  PLUGINS_CONFIG,
  WINDOW_MODELS,
  WINDOWS
};
