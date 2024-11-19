import {
  CONVERTIBLE_EXTENSIONS,
  MODEL_CONFIG,
  MODEL_EXTENSIONS,
  MODEL_SOURCE,
  MODEL_TYPE
} from "../config/models.js";
import { fileExtension } from "./files.js";
import routeNames from "../router/route-names.js";

function segregateBySource(models) {
  const { EXPORT, MERGE, SPLIT } = MODEL_SOURCE;

  const result = {
    upload: [],
    split: [],
    merge: [],
    archive: []
  };

  for (const model of models) {
    if (model.archived) {
      result.archive.push(model);
      continue;
    }
    switch (model.source) {
      case EXPORT:
      case SPLIT:
        result.split.push(model);
        break;
      case MERGE:
        result.merge.push(model);
        break;
      default:
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

function isModel(document) {
  return !!document.model_id;
}

function isIFC(document) {
  return isModel(document) && document.model_type === MODEL_TYPE.IFC;
}

function isPDF(document) {
  return fileExtension(document.file_name) === MODEL_EXTENSIONS.PDF;
}

function isViewable(document) {
  const { IFC, DWG, DXF, PDF } = MODEL_TYPE;
  return [IFC, DWG, DXF, PDF].includes(document.model_type);
}

function isConvertible(document) {
  return CONVERTIBLE_EXTENSIONS.includes(
    fileExtension(document.file_name).toLowerCase()
  );
}

function isConvertibleToPhotosphere(document) {
  const { JPEG, JPG } = MODEL_EXTENSIONS;
  return [JPEG, JPG].includes(
    fileExtension(document.file_name).toLowerCase()
  );
}

function openInViewer(router, project, model, window) {
  const models = [].concat(model);
  router.push({
    name: routeNames.modelViewer,
    params: {
      spaceID: project.cloud.id,
      projectID: project.id,
      modelIDs: models.map(m => m.id).join(",")
    },
    query: {
      window: window || MODEL_CONFIG[models[0].type].window
    }
  });
}

export {
  isConvertible,
  isConvertibleToPhotosphere,
  isIFC,
  isModel,
  isPDF,
  isViewable,
  openInViewer,
  segregateBySource,
  segregateByType
};
