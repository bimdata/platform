import apiClient from "./index";

class ProjectsService {
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

  updateProject(space, project) {
    return apiClient.collaborationApi.updateProject({
      cloudPk: space.id,
      id: project.id,
      data: project
    });
  }

  deleteProject(space, project) {
    return apiClient.collaborationApi.deleteProject({
      cloudPk: space.id,
      id: project.id
    });
  }
}

const service = new ProjectsService();

export default service;
