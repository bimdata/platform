import apiClient from "./api-client";

class ProjectService {
  fetchSpaceProjects(space) {
    return apiClient.collaborationApi.getProjects({
      cloudPk: space.id
    });
  }

  createProject(space, project) {
    return apiClient.collaborationApi.createProject({
      cloudPk: space.id,
      data: project
    });
  }

  updateProject(project) {
    return apiClient.collaborationApi.updateProject({
      cloudPk: project.cloud.id,
      id: project.id,
      data: project
    });
  }

  deleteProject(project) {
    return apiClient.collaborationApi.deleteProject({
      cloudPk: project.cloud.id,
      id: project.id
    });
  }
}

const service = new ProjectService();

export default service;
