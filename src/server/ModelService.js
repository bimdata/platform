import apiClient from "./api-client";

class ModelService {
  fetchModels(project) {
    return apiClient.ifcApi.getIfcs({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  updateModels(project, models) {
    models = [].concat(models);
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
  }

  deleteModels(project, models) {
    models = [].concat(models);
    return Promise.all(
      models.map(model =>
        apiClient.ifcApi.deleteIfc({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          id: model.id
        })
      )
    );
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
    elements = [].concat(elements);
    return apiClient.ifcApi.createElement({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      ifcPk: model.id,
      data: elements
    });
  }

  updateModelElements(project, model, elements) {
    elements = [].concat(elements);
    return apiClient.ifcApi.bulkUpdateElements({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      ifcPk: model.id,
      data: elements
    });
  }

  deleteModelElements(project, model, elements) {
    elements = [].concat(elements);
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
  }

  createModelElementPsetProperties(project, model, element, pset, properties) {
    properties = [].concat(properties);
    properties = properties.map(({ name, value }) => ({
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
  }

  updateModelElementPsetProperties(project, model, element, pset, properties) {
    properties = [].concat(properties);
    properties = properties.map(({ id, name, value }) => ({
      id,
      definition: { name },
      value
    }));
    return Promise.all(
      properties.map(property =>
        apiClient.ifcApi.updateElementPropertySetProperty({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          ifcPk: model.id,
          elementUuid: element.uuid,
          propertysetPk: pset.id,
          id: property.id,
          data: property
        })
      )
    );
  }

  deleteModelElementPsetProperties(project, model, element, pset, properties) {
    properties = [].concat(properties);
    return Promise.all(
      properties.map(property =>
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
  }

  createModelElementAttrProperties(project, model, element, properties) {
    return this.createModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      properties
    );
  }

  updateModelElementAttrProperties(project, model, element, properties) {
    return this.updateModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      properties
    );
  }

  deleteModelElementAttrProperties(project, model, element, properties) {
    return this.deleteModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      properties
    );
  }

  optimizeModel(project, model) {
    return apiClient.ifcApi.optimizeIfc({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: model.id,
      data: {}
    });
  }

  reprocessModel(project, model) {
    return apiClient.ifcApi.reprocessIfc({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: model.id
    });
  }

  exportModel(project, model, modelExport) {
    return apiClient.ifcApi.exportIfc({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: model.id,
      data: modelExport
    });
  }

  mergeModels(project, models, name) {
    return apiClient.ifcApi.mergeIfcs({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      data: {
        ifcIds: models.map(model => model.id),
        exportName: name
      }
    });
  }
}

const service = new ModelService();

export default service;
