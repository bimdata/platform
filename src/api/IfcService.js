import apiClient from "./index";

class IfcService {
  fetchProjectIfcs(space, project) {
    return apiClient.ifcApi.getIfcs({
      cloudPk: space.id,
      projectPk: project.id
    });
  }
}

const service = new IfcService();

export default service;
