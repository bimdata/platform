import { MODEL_TYPE, MODEL_SOURCE } from "@/config/models.js";

function segregateBySource(models) {
  const result = {
    upload: [],
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
      result.upload.push(model);
    } else if (
      [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
    ) {
      result.split.push(model);
    } else if (MODEL_SOURCE.MERGE === model.source) {
      result.merge.push(model);
    } else {
      result.upload.push(model);
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
      case MODEL_TYPE.DWG:
        result.dwg.push(model);
        break;
      case MODEL_TYPE.IFC:
        result.ifc.push(model);
        break;
      case MODEL_TYPE.PDF:
        result.pdf.push(model);
        break;
    }
  }
  return result;
}

export { segregateBySource, segregateByType };
