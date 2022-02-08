import { downloadAll } from "@/utils/download.js";
import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";

class ModelService {
  async fetchModels(project) {
    try {
      return await apiClient.modelApi.getModels({
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

  async fetchModelByID(project, id) {
    try {
      return await apiClient.modelApi.getModel({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id
      });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async updateModels(project, models) {
    try {
      return await Promise.all(
        models.map(model =>
          apiClient.modelApi.updateModel({
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

  async downloadModels(models) {
    try {
      return await downloadAll(
        models.map(model => ({
          name: model.document.fileName,
          url: model.document.file
        }))
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_DOWNLOAD_ERROR, error);
    }
  }

  async deleteModels(project, models) {
    try {
      return await Promise.all(
        models.map(model =>
          apiClient.modelApi.deleteModel({
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
    return apiClient.modelApi.getElements({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      modelPk: model.id,
      ...params
    });
  }

  fetchModelElementsByType(project, model, type) {
    return this.fetchModelElements(project, model, { type });
  }

  async createModelElements(project, model, elements) {
    try {
      return await apiClient.modelApi.createElement({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        modelPk: model.id,
        data: elements
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async updateModelElements(project, model, elements) {
    try {
      return await apiClient.modelApi.bulkUpdateElements({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        modelPk: model.id,
        data: elements
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.MODEL_UPDATE_ERROR, error);
    }
  }

  async deleteModelElements(project, model, elements) {
    try {
      return await Promise.all(
        elements.map(element =>
          apiClient.modelApi.deleteElement({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            modelPk: model.id,
            uuid: element.uuid
          })
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
          apiClient.modelApi.createElementPropertySetProperty({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            modelPk: model.id,
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
            return apiClient.modelApi.updateElementPropertySetProperty({
              cloudPk: project.cloud.id,
              projectPk: project.id,
              modelPk: model.id,
              elementUuid: element.uuid,
              propertysetPk: pset.id,
              id: property.id,
              data: property
            });
          } else {
            return apiClient.modelApi.createElementPropertySetProperty({
              cloudPk: project.cloud.id,
              projectPk: project.id,
              modelPk: model.id,
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

  async deleteModelElementPsetProperties(project, model, element, pset, props) {
    try {
      return await Promise.all(
        props.map(property =>
          apiClient.modelApi.removeElementPropertySetProperty({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            modelPk: model.id,
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

  async mergeModels(project, models, name) {
    try {
      return await apiClient.modelApi.mergeIfcs({
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
