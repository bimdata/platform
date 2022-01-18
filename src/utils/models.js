import MODEL_SOURCES from "@/config/model-sources.js";
import MODEL_TYPES from "@/config/model-types.js";

function segregateBySource(models) {
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

function segregateByType(models) {
  const result = {
    dwg: [],
    ifc: [],
    pdf: []
  };
  for (const model of models) {
    switch (model.type) {
      case MODEL_TYPES.DWG:
        result.dwg.push(model);
        break;
      case MODEL_TYPES.IFC:
        result.ifc.push(model);
        break;
      case MODEL_TYPES.PDF:
        result.pdf.push(model);
        break;
    }
  }
  return result;
}

export { segregateBySource, segregateByType };
