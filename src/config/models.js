/* eslint-disable */

import { WINDOWS } from "./viewer.js";

/**
 * List of all model types.
 */
const MODEL_TYPE = Object.freeze({
  BFX: "BFX",
  DAE: "DAE",
  DWG: "DWG",
  DXF: "DXF",
  GLTF: "GLTF",
  IFC: "IFC",
  JPEG: "JPEG",
  META_BUILDING: "METABUILDING",
  OBJ: "OBJ",
  PDF: "PDF",
  PHOTOSPHERE: "PHOTOSPHERE",
  PHOTOSPHERE_BUILDING: "PHOTOSPHERE_BUILDING",
  PNG: "PNG",
  POINT_CLOUD: "POINT_CLOUD",
});

/**
 * List of all possible model file extensions.
 */
const MODEL_EXTENSIONS = Object.freeze({
  DWG: ".dwg",
  DXF: ".dxf",
  E57: ".e57",
  IFC: ".ifc",
  IFCZIP: ".ifczip",
  JPEG: ".jpeg",
  JPG: ".jpg",
  LAS: ".las",
  LAZ: ".laz",
  PDF: ".pdf",
  PLY: ".ply",
  PNG: ".png",
  XYZ: ".xyz",
});

/**
 * List of file extensions that can be directly uploaded as models.
 */
const UPLOADABLE_EXTENSIONS = Object.freeze([
  MODEL_EXTENSIONS.DWG,
  MODEL_EXTENSIONS.DXF,
  MODEL_EXTENSIONS.E57,
  MODEL_EXTENSIONS.IFC,
  MODEL_EXTENSIONS.IFCZIP,
  MODEL_EXTENSIONS.LAS,
  MODEL_EXTENSIONS.LAZ,
  MODEL_EXTENSIONS.PLY,
  MODEL_EXTENSIONS.XYZ,
]);

/**
 * List of file extensions that can be converted to models.
 */
const CONVERTIBLE_EXTENSIONS = Object.freeze([
  MODEL_EXTENSIONS.JPEG,
  MODEL_EXTENSIONS.JPG,
  MODEL_EXTENSIONS.PDF,
  MODEL_EXTENSIONS.PNG,
]);

/**
 * List of all possible model sources.
 */
const MODEL_SOURCE = Object.freeze({
  UPLOAD: "UPLOAD",
  SPLIT: "SPLIT",
  EXPORT: "EXPORT",
  MERGE: "MERGE",
  OPTIMIZED: "OPTIMIZED",
});

/**
 * List of all model statuses.
 */
const MODEL_STATUS = Object.freeze({
  PENDING: "P",
  IN_PROGRESS: "I",
  COMPLETED: "C",
  ERROR: "E",
});

const MODEL_CONFIG = Object.freeze({
  [MODEL_TYPE.DWG]: {
    ext: [MODEL_EXTENSIONS.DWG],
    window: WINDOWS.DWG,
    icon: "fileDwgPolychrome",
  },
  [MODEL_TYPE.DXF]: {
    ext: [MODEL_EXTENSIONS.DXF],
    window: WINDOWS.DXF,
    icon: "fileDxfPolychrome",
  },
  [MODEL_TYPE.IFC]: {
    ext: [MODEL_EXTENSIONS.IFC, MODEL_EXTENSIONS.IFCZIP],
    window: WINDOWS.IFC3D,
    icon: "fileIfcPolychrome",
  },
  [MODEL_TYPE.JPEG]: {
    ext: [MODEL_EXTENSIONS.JPEG, MODEL_EXTENSIONS.JPG],
    window: WINDOWS.PLAN,
    icon: "fileJpegPolychrome",
  },
  [MODEL_TYPE.META_BUILDING]: {
    ext: [],
    window: WINDOWS.PLAN,
    icon: "filePlanPolychrome",
  },
  [MODEL_TYPE.PDF]: {
    ext: [MODEL_EXTENSIONS.PDF],
    window: WINDOWS.PLAN,
    icon: "filePdfPolychrome",
  },
  [MODEL_TYPE.PHOTOSPHERE]: {
    ext: [MODEL_EXTENSIONS.JPEG, MODEL_EXTENSIONS.JPG],
    window: WINDOWS.PHOTOSPHERE,
    icon: "fileImagePolychrome",
  },
  [MODEL_TYPE.PHOTOSPHERE_BUILDING]: {
    ext: [],
    window: WINDOWS.PHOTOSPHERE,
    icon: "fileImagePolychrome",
  },
  [MODEL_TYPE.PNG]: {
    ext: [MODEL_EXTENSIONS.PNG],
    window: WINDOWS.PLAN,
    icon: "filePngPolychrome",
  },
  [MODEL_TYPE.POINT_CLOUD]: {
    ext: [
      MODEL_EXTENSIONS.E57,
      MODEL_EXTENSIONS.LAS,
      MODEL_EXTENSIONS.LAZ,
      MODEL_EXTENSIONS.PLY,
      MODEL_EXTENSIONS.XYZ
    ],
    window: WINDOWS.POINT_CLOUD,
    icon: "filePointCloudPolychrome",
  },
});

export {
  CONVERTIBLE_EXTENSIONS,
  MODEL_CONFIG,
  MODEL_EXTENSIONS,
  MODEL_SOURCE,
  MODEL_STATUS,
  MODEL_TYPE,
  UPLOADABLE_EXTENSIONS
};
