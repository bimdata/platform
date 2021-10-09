import MODEL_SOURCES from "@/config/model-sources";

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
      [MODEL_SOURCES.UPLOAD, MODEL_SOURCES.OPTIMIZED].includes(model.source)
    ) {
      result.ifc.push(model);
    } else if (
      [MODEL_SOURCES.SPLIT, MODEL_SOURCES.EXPORT].includes(model.source)
    ) {
      result.split.push(model);
    } else if (MODEL_SOURCES.MERGE === model.source) {
      result.merge.push(model);
    } else {
      result.ifc.push(model);
    }
  }
  return result;
}

export { segregate };
