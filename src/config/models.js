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
  PNG: "PNG",
  POINT_CLOUD: "POINT_CLOUD",
  PHOTOS: "PHOTOS"
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
  PNG: ".png",
  E57: ".e57",
  LAS: ".las",
  LAZ: ".laz",
  XYZ: ".xyz",
  PLY: ".ply"
});

/**
 * List of file extensions that can be directly uploaded as models.
 */
const UPLOADABLE_EXTENSIONS = Object.freeze([
  ".dwg",
  ".dxf",
  ".ifc",
  ".ifczip",
  ".pdf"
]);

/**
 * List of file extensions that can be marked as models.
 */
// eslint-disable-next-line prettier/prettier
const CONVERTIBLE_EXTENSIONS = Object.freeze([
  ".jpeg",
  ".jpg",
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

const MODEL_ICON = Object.freeze({
  [MODEL_TYPE.IFC]: "fileIfcPolychrome",
  [MODEL_TYPE.DXF]: "fileDxfPolychrome",
  [MODEL_TYPE.DWG]: "fileDwgPolychrome",
  [MODEL_TYPE.JPEG]: "fileJpegPolychrome",
  [MODEL_TYPE.PNG]: "filePngPolychrome",
  [MODEL_TYPE.PDF]: "filePdfPolychrome",
  [MODEL_TYPE.META_BUILDING]: "filePlanPolychrome",
  [MODEL_TYPE.POINT_CLOUD]: "filePointCloudPolychrome",
  [MODEL_TYPE.PHOTOS]: "fileImagePolychrome"
});

export {
  CONVERTIBLE_EXTENSIONS,
  MODEL_EXTENSIONS,
  MODEL_SOURCE,
  MODEL_STATUS,
  MODEL_TYPE,
  UPLOADABLE_EXTENSIONS,
  MODEL_ICON
};
