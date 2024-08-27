const FILE_PERMISSION = Object.freeze({
  DEFAULT: null,
  ACCESS_DENIED: 1,
  READ_ONLY: 50,
  READ_WRITE: 100
});

const FILE_TYPE = Object.freeze({
  FOLDER: "Folder",
  DOCUMENT: "Document",
  MODEL: "Model",
});

const STANDARD_IGNORED_FILES = Object.freeze([".DS_Store"]);

const OFFICE_FILES = [".ppt", ".pptx", ".odp", ".xls", ".xlsx", ".ods", ".doc", ".docx", ".odt"];

const IMAGE_PREVIEW_FILES = [".apng", ".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"];

export { FILE_PERMISSION, FILE_TYPE, STANDARD_IGNORED_FILES, OFFICE_FILES, IMAGE_PREVIEW_FILES };
