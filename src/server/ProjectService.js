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

  sendProjectInvitation(project, invitation) {
    return apiClient.collaborationApi.inviteCloudUser({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      data: {
        email: invitation.email,
        role: invitation.role,
        redirectUri: `${process.env.VUE_APP_BASE_URL}/spaces/${project.cloud.id}/projects/${project.id}`
      }
    });
  }

  cancelProjectInvitation(project, invitation) {
    return apiClient.collaborationApi.cancelProjectUserInvitation({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: invitation.id
    });
  }

  deleteProjectUser(project, user) {
    return apiClient.collaborationApi.deleteProjectUser({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: user.id
    });
  }
}

const service = new ProjectService();

export default service;
