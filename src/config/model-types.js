const MODEL_TYPES = Object.freeze({
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
  ".pdf"
]);

export default MODEL_TYPES;

export { MODEL_EXTENSIONS, MODEL_TYPES };
