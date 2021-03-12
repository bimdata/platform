import apiClient from "./api-client";

class ProjectService {
  fetchUserProjects() {
    return apiClient.collaborationApi.getSelfProjects();
  }

  fetchSpaceProjects(space) {
    return apiClient.collaborationApi.getProjects({
      cloudPk: space.id
    });
  }

  fetchProjectUsers(project) {
    return apiClient.collaborationApi.getProjectUsers({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  fetchProjectInvitations(project) {
    return apiClient.collaborationApi.getProjectInvitations({
      cloudPk: project.cloud.id,
      projectPk: project.id
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
