import apiClient from "./api-client";

class ProjectService {
  constructor() {
    this.data = {
      projects: undefined
    };
  }

  async fetchSpaceProjects(space, options = {}) {
    if (!this.data.projects || options.forceFetch) {
      this.data.projects = await apiClient.collaborationApi.getProjects({
        cloudPk: space.id
      });
    }
    return this.data.projects;
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
