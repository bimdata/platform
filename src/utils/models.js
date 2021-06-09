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

function segregate(models) {
  const result = {
    ifc: [],
    split: [],
    merge: [],
    archive: []
  };
  for (const model of models) {
    if (model.archived) {
      result.archive.push(model);
    } else if (
      [MODEL_SOURCE.UPLOAD, MODEL_SOURCE.OPTIMIZED].includes(model.source)
    ) {
      result.ifc.push(model);
    } else if (
      [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
    ) {
      result.split.push(model);
    } else if (MODEL_SOURCE.MERGE === model.source) {
      result.merge.push(model);
    } else {
      result.ifc.push(model);
    }
  }
  return result;
}

export { MODEL_SOURCE, MODEL_STATUS, segregate };
