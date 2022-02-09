const FILE_PERMISSION = Object.freeze({
  ACCESS_DENIED: 1,
  READ_ONLY: 50,
  READ_WRITE: 100
});

const FILE_TYPE = Object.freeze({
  FOLDER: "Folder",
  DOCUMENT: "Document",
  IFC: "Ifc"
});

export { FILE_PERMISSION, FILE_TYPE };
