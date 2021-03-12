import apiClient from "./api-client";

class IfcService {
  fetchProjectIfcs(project) {
    return apiClient.ifcApi.getIfcs({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  fetchIfcElements(project, model, params = {}) {
    return apiClient.ifcApi.getElements({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      ifcPk: model.id,
      ...params
    });
  }

  fetchIfcElementsByType(project, model, type) {
    return this.fetchIfcElements(project, model, { type });
  }
}

const service = new IfcService();

export default service;
