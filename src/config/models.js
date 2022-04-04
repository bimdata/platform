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
  PNG: "PNG"
});

/**
 * List of all possible model file extensions.
 */
const MODEL_EXTENSIONS = Object.freeze([
  ".dwg",
  ".dxf",
  ".ifc",
  ".ifczip",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png"
]);

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

export {
  CONVERTIBLE_EXTENSIONS,
  MODEL_EXTENSIONS,
  MODEL_SOURCE,
  MODEL_STATUS,
  MODEL_TYPE,
  UPLOADABLE_EXTENSIONS
};
