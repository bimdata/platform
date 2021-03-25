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

export { MODEL_SOURCE, MODEL_STATUS };
