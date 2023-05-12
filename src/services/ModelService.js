import queue from "async/queue";
import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";
import { isPlan } from "../utils/models.js";

class ModelService {
  callQueue = queue(async task => {
    return await task();
  }, 40);

  async fetchModels(project) {
    try {
      return await this.callQueue.push(() => apiClient.modelApi.getModels(project.cloud.id, project.id));
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.MODELS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchModelByID(project, id) {
    try {
      return await apiClient.modelApi.getModel(
        project.cloud.id,
        id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async createModel(project, file) {
    try {
      return await apiClient.modelApi.createModel(
        project.cloud.id,
        project.id,
        {
          document_id: file.id
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_CREATE_ERROR, error);
    }
  }

  async updateModels(project, models) {
    try {
      return await Promise.all(
        models.map(model =>
          apiClient.modelApi.updateModel(
            project.cloud.id,
            model.id,
            project.id,
            model
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async deleteModels(project, models, { hard } = {}) {
    try {
      return await Promise.all(
        models.map(model => {
          if (isPlan(model) && !hard) {
            return apiClient.modelApi.deleteModelWithoutDoc(
              project.cloud.id,
              model.id,
              project.id
            );
          } else {
            return apiClient.modelApi.deleteModel(
              project.cloud.id,
              model.id,
              project.id
            );
          }
        })
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_DELETE_ERROR, error);
    }
  }

  fetchModelElements(project, model, params = {}) {
    return apiClient.modelApi.getElements(
      project.cloud.id,
      model.id,
      project.id,
      params.classification,
      params.classificationNotation,
      params.type
    );
  }

  fetchModelElementsByType(project, model, type) {
    return this.fetchModelElements(project, model, { type });
  }

  async createModelElements(project, model, elements) {
    try {
      return await apiClient.modelApi.createElement(
        project.cloud.id,
        model.id,
        project.id,
        elements
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async updateModelElements(project, model, elements) {
    try {
      return await apiClient.modelApi.bulkUpdateElements(
        project.cloud.id,
        model.id,
        project.id,
        elements
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async deleteModelElements(project, model, elements) {
    try {
      return await Promise.all(
        elements.map(element =>
          apiClient.modelApi.deleteElement(
            project.cloud.id,
            model.id,
            project.id,
            element.uuid
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async createModelElementPsetProperties(project, model, element, pset, props) {
    try {
      const properties = props.map(({ name, value }) => ({
        definition: { name },
        value
      }));
      return await Promise.all(
        properties.map(property =>
          apiClient.modelApi.createElementPropertySetProperty(
            project.cloud.id,
            element.uuid,
            model.id,
            project.id,
            pset.id,
            property
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async updateModelElementPsetProperties(project, model, element, pset, props) {
    try {
      const properties = props.map(({ id, name, value }) => ({
        id,
        definition: { name },
        value
      }));
      return await Promise.all(
        properties.map(property => {
          if (property.id) {
            return apiClient.modelApi.updateElementPropertySetProperty(
              project.cloud.id,
              element.uuid,
              property.id,
              model.id,
              project.id,
              pset.id,
              property
            );
          } else {
            return apiClient.modelApi.createElementPropertySetProperty(
              project.cloud.id,
              element.uuid,
              model.id,
              project.id,
              pset.id,
              property
            );
          }
        })
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async deleteModelElementPsetProperties(project, model, element, pset, props) {
    try {
      return await Promise.all(
        props.map(property =>
          apiClient.modelApi.removeElementPropertySetProperty(
            project.cloud.id,
            element.uuid,
            property.id,
            model.id,
            project.id,
            pset.id
          )
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

  async mergeModels(project, models, name) {
    try {
      return await apiClient.modelApi.mergeIfcs(project.cloud.id, project.id, {
        ifc_ids: models.map(model => model.id),
        export_name: name
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_MERGE_ERROR, error);
    }
  }
}

const service = new ModelService();

export default service;
