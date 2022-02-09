const MODEL_TYPE = Object.freeze({
  BFX: "BFX",
  DAE: "DAE",
  DWG: "DWG",
  DXF: "DXF",
  GLTF: "GLTF",
  IFC: "IFC",
  JPEG: "JPEG",
  OBJ: "OBJ",
  PDF: "PDF",
  PNG: "PNG"
});

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

// eslint-disable-next-line prettier/prettier
const CONVERTIBLE_EXTENSIONS = Object.freeze([
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png"
]);

const MODEL_SOURCE = Object.freeze({
  UPLOAD: "UPLOAD",
  SPLIT: "SPLIT",
  EXPORT: "EXPORT",
  MERGE: "MERGE",
  OPTIMIZED: "OPTIMIZED"
});

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
  MODEL_TYPE
};
