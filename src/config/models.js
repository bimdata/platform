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
  JPG: "JPEG",
  META_BUILDING: "METABUILDING",
  OBJ: "OBJ",
  PDF: "PDF",
  PNG: "PNG",
  POINT_CLOUD: "POINT_CLOUD"
});

/**
 * List of all possible model file extensions.
 */
const MODEL_EXTENSIONS = Object.freeze({
  DWG: ".dwg",
  DXF: ".dxf",
  IFC: ".ifc",
  IFCZIP: ".ifczip",
  JPEG: ".jpeg",
  JPG: ".jpg",
  PDF: ".pdf",
  PNG: ".png"
});

/**
 * List of file extensions that can be directly uploaded as models.
 */
const UPLOADABLE_EXTENSIONS = Object.freeze([
  ".dwg",
  ".dxf",
  ".ifc",
  ".ifczip"
]);

/**
 * List of file extensions that can be marked as models.
 */
// eslint-disable-next-line prettier/prettier
const CONVERTIBLE_EXTENSIONS = Object.freeze([
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png"
]);

/**
 * List of all possible model sources.
 */
const MODEL_SOURCE = Object.freeze({
  UPLOAD: "UPLOAD",
  SPLIT: "SPLIT",
  EXPORT: "EXPORT",
  MERGE: "MERGE",
  OPTIMIZED: "OPTIMIZED"
});

/**
 * List of all model statuses.
 */
const MODEL_STATUS = Object.freeze({
  PENDING: "P",
  IN_PROGRESS: "I",
  COMPLETED: "C",
  ERROR: "E"
});

const MODEL_ICON_POLYCHROME = Object.freeze({
  IFC: "fileIfcPolychrome",
  DXF: "fileDxfPolychrome",
  DWG: "fileDwgPolychrome",
  JPEG: "fileJpegPolychrome",
  PNG: "filePngPolychrome",
  PDF: "filePdfPolychrome",
  PLAN: "filePlanPolychrome"
});

export {
  CONVERTIBLE_EXTENSIONS,
  MODEL_EXTENSIONS,
  MODEL_SOURCE,
  MODEL_STATUS,
  MODEL_TYPE,
  UPLOADABLE_EXTENSIONS,
  MODEL_ICON_POLYCHROME
};
