import apiClient from "./api-client";

class ModelService {
  fetchProjectModels(project) {
    return apiClient.ifcApi.getIfcs({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  updateModel(project, model) {
    return apiClient.ifcApi.updateIfc({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: model.id
    });
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

  updateModelElements(project, model, element) {
    return apiClient.ifcApi.updateElement({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      ifcPk: model.id,
      uuid: element.uuid,
      data: element
    });
  }

  /**
   * @param {Object} project a project
   * @param {Object} model a model of the project
   * @param {Object} element an element of the model
   * @param {Object} pset a property set of this element
   * @param {Array} properties a list of property name/value pairs
   * @param {Object} options an (optional) otpions object
   * @returns {Promise}
   */
  setModelElementPsetProperties(
    project,
    model,
    element,
    pset,
    properties,
    options = {}
  ) {
    const propsData = properties.map(({ name, value }) => ({
      definition: { name },
      value
    }));
    const requestMethod = options.update
      ? "updateElementPropertySetProperty"
      : "createElementPropertySetProperty";
    return Promise.all(
      propsData.map(data =>
        apiClient.ifcApi[requestMethod]({
          cloudPk: project.cloud.id,
          projectPk: project.id,
          ifcPk: model.id,
          elementUuid: element.uuid,
          propertysetPk: pset.id,
          data
        })
      )
    );
  }

  setModelElementAttributesProperties(
    project,
    model,
    element,
    properties,
    options = {}
  ) {
    return this.setModelElementPsetProperties(
      project,
      model,
      element,
      element.attributes,
      properties,
      options
    );
  }
}

const service = new ModelService();

export default service;
