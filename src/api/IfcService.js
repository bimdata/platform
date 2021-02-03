import apiClient from "./index";

class IfcService {
  fetchProjectIfcs(project) {
    return apiClient.ifcApi.getIfcs({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }
}

const service = new IfcService();

export default service;
