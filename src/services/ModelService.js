import { downloadAll } from "@/utils/download";
import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";

class ModelService {
  fetchModels(project) {
    try {
      return apiClient.ifcApi.getIfcs({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.MODELS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  fetchModelByID(project, id) {
    try {
      return apiClient.ifcApi.getIfc({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id
      });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  updateModels(project, models) {
    try {
      return Promise.all(
        models.map(model =>
          apiClient.ifcApi.updateIfc({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: model.id,
            data: model
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  downloadModels(models) {
    try {
      return downloadAll(
        models.map(model => ({
          name: model.document.fileName,
          url: model.document.file
        }))
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_DOWNLOAD_ERROR, error);
    }
  }

  deleteModels(project, models) {
    try {
      return Promise.all(
        models.map(model =>
          apiClient.ifcApi.deleteIfc({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            id: model.id
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_DELETE_ERROR, error);
    }
  }

  fetchModelElements(project, model, params = {}) {
    return apiClient.ifcApi.getElements({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      ifcPk: model.id,
      ...params
    });
  }

  fetchModelElementsByType(project, model, type) {
    return this.fetchModelElements(project, model, { type });
  }

  createModelElements(project, model, elements) {
    try {
      return apiClient.ifcApi.createElement({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        ifcPk: model.id,
        data: elements
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  updateModelElements(project, model, elements) {
    try {
      return apiClient.ifcApi.bulkUpdateElements({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        ifcPk: model.id,
        data: elements
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  deleteModelElements(project, model, elements) {
    try {
      return Promise.all(
        elements.map(element =>
          apiClient.ifcApi.deleteElement({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            ifcPk: model.id,
            uuid: element.uuid
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  createModelElementPsetProperties(project, model, element, pset, props) {
    try {
      const properties = props.map(({ name, value }) => ({
        definition: { name },
        value
      }));
      return Promise.all(
        properties.map(property =>
          apiClient.ifcApi.createElementPropertySetProperty({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            ifcPk: model.id,
            elementUuid: element.uuid,
            propertysetPk: pset.id,
            data: property
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  updateModelElementPsetProperties(project, model, element, pset, props) {
    try {
      const properties = props.map(({ id, name, value }) => ({
        id,
        definition: { name },
        value
      }));
      return Promise.all(
        properties.map(property => {
          if (property.id) {
            return apiClient.ifcApi.updateElementPropertySetProperty({
              cloudPk: project.cloud.id,
              projectPk: project.id,
              ifcPk: model.id,
              elementUuid: element.uuid,
              propertysetPk: pset.id,
              id: property.id,
              data: property
            });
          } else {
            return apiClient.ifcApi.createElementPropertySetProperty({
              cloudPk: project.cloud.id,
              projectPk: project.id,
              ifcPk: model.id,
              elementUuid: element.uuid,
              propertysetPk: pset.id,
              data: property
            });
          }
        })
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  deleteModelElementPsetProperties(project, model, element, pset, props) {
    try {
      return Promise.all(
        props.map(property =>
          apiClient.ifcApi.removeElementPropertySetProperty({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            ifcPk: model.id,
            elementUuid: element.uuid,
            propertysetPk: pset.id,
            id: property.id
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  createModelElementAttrProperties(project, model, element, props) {
    return this.createModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      props
    );
  }

  updateModelElementAttrProperties(project, model, element, props) {
    return this.updateModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      props
    );
  }

  deleteModelElementAttrProperties(project, model, element, props) {
    return this.deleteModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      props
    );
  }

  mergeModels(project, models, name) {
    try {
      return apiClient.ifcApi.mergeIfcs({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        data: {
          ifcIds: models.map(model => model.id),
          exportName: name
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_MERGE_ERROR, error);
    }
  }
}

const service = new ModelService();

export default service;
