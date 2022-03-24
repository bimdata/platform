import {
  CONVERTIBLE_EXTENSIONS,
  MODEL_EXTENSIONS,
  MODEL_TYPE,
  MODEL_SOURCE
} from "@/config/models.js";
import { WINDOWS } from "@/config/viewer.js";
import { fileExtension } from "./files.js";

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
      case MODEL_TYPE.META_BUILDING:
        result.pdf.push(model);
        break;
    }
  }
  return result;
}

function isModel(file) {
  return !!file.modelId;
}

function isPlanModel(model) {
  const { JPG, PDF, PNG } = MODEL_TYPE;
  return [JPG, PDF, PNG].includes(model.type);
}

function isIFC(file) {
  return isModel(file) && file.modelType === MODEL_TYPE.IFC;
}

function isSmartFile(file) {
  const { IFC, DWG, PDF, DXF } = MODEL_EXTENSIONS;

  return [IFC, DWG, PDF, DXF].includes(
    fileExtension(file.fileName).toLowerCase()
  );
}

function isViewable(file) {
  const { IFC, DWG, PDF, DXF } = MODEL_TYPE;
  return [IFC, DWG, PDF, DXF].includes(file.modelType);
}

function isConvertibleToModel(file) {
  return (
    CONVERTIBLE_EXTENSIONS.includes(
      fileExtension(file.fileName).toLowerCase()
    ) && !isModel(file)
  );
}

function windowType(file) {
  const { modelType } = file;
  const { IFC, DWG } = MODEL_TYPE;

  if (modelType === IFC) return WINDOWS.V3D;
  if (modelType === DWG) return WINDOWS.DWG;

  return WINDOWS.PLAN;
}

export {
  isConvertibleToModel,
  isIFC,
  isModel,
  isPlanModel,
  isSmartFile,
  segregateBySource,
  segregateByType,
  isViewable,
  windowType
};
