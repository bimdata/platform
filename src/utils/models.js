import {
  CONVERTIBLE_EXTENSIONS,
  MODEL_EXTENSIONS,
  MODEL_TYPE,
  MODEL_SOURCE
} from "../config/models.js";
import { WINDOWS } from "../config/viewer.js";
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
  const result = {};
  for (const model of models) {
    if (!result[model.type]) {
      result[model.type] = [];
    }
    result[model.type].push(model);
  }
  return result;
}

function isModel(file) {
  return !!file.model_id;
}

function isPlanModel(model) {
  const { JPEG, PDF, PNG } = MODEL_TYPE;
  return [JPEG, PDF, PNG].includes(model.type);
}

function isIFC(file) {
  return isModel(file) && file.model_type === MODEL_TYPE.IFC;
}

function isPDF(file) {
  return fileExtension(file.file_name) === MODEL_EXTENSIONS.PDF;
}

function isSmartFile(file) {
  return Object.values(MODEL_EXTENSIONS).includes(
    fileExtension(file.file_name).toLowerCase()
  );
}

function isViewable(file) {
  const { IFC, DWG, PDF, DXF } = MODEL_TYPE;
  return [IFC, DWG, PDF, DXF].includes(file.model_type);
}

function isConvertible(file) {
  return CONVERTIBLE_EXTENSIONS.includes(
    fileExtension(file.file_name).toLowerCase()
  );
}

function windowType(file) {
  const { model_type } = file;
  const { IFC, DWG, DXF } = MODEL_TYPE;

  if (model_type === IFC) return WINDOWS.IFC3D;
  if (model_type === DWG) return WINDOWS.DWG;
  if (model_type === DXF) return WINDOWS.DXF;

  return WINDOWS.PLAN;
}

function extensionListFromType(type) {
  const { IFC, DWG, DXF, PDF, POINT_CLOUD, PHOTOS } = MODEL_TYPE;

  if (type === IFC) return [MODEL_EXTENSIONS.IFC];
  if (type === DWG) return [MODEL_EXTENSIONS.DWG];
  if (type === DXF) return [MODEL_EXTENSIONS.DXF];
  if (type === PDF) return [MODEL_EXTENSIONS.PDF];
  if (type === PHOTOS) return [MODEL_EXTENSIONS.PNG, MODEL_EXTENSIONS.JPEG];
  if (type === POINT_CLOUD)
    return [
      MODEL_EXTENSIONS.E57,
      MODEL_EXTENSIONS.LAS,
      MODEL_EXTENSIONS.LAZ,
      MODEL_EXTENSIONS.XYZ,
      MODEL_EXTENSIONS.PLY
    ];
}

export {
  isConvertible,
  isIFC,
  isPDF,
  isModel,
  isPlanModel,
  isSmartFile,
  segregateBySource,
  segregateByType,
  isViewable,
  windowType,
  extensionListFromType
};
