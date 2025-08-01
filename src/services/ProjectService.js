import { apiClient, backendClient } from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";

class ProjectService {
  async fetchUserProjects() {
    try {
      return await apiClient.collaborationApi.getSelfProjects();
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error));
      return [];
    }
  }

  async fetchSpaceProjects(space) {
    try {
      return await apiClient.collaborationApi.getProjects(space.id);
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error));
      return [];
    }
  }

  async fetchProjectByID(space, id) {
    try {
      return await apiClient.collaborationApi.getProject(space.id, id);
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async fetchProjectUsers(project) {
    try {
      return await apiClient.collaborationApi.getProjectUsers(project.cloud.id, project.id);
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.USERS_FETCH_ERROR, error));
      return [];
    }
  }

  async fetchProjectInvitations(project) {
    try {
      return await apiClient.collaborationApi.getProjectInvitations(project.cloud.id, project.id);
    } catch (error) {
      ErrorService.handleError(new RuntimeError(ERRORS.INVITATIONS_FETCH_ERROR, error));
      return [];
    }
  }

  async createProject(space, project) {
    try {
      return await apiClient.collaborationApi.createProject(space.id, project);
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_CREATE_ERROR, error);
    }
  }

  async updateProject(project) {
    try {
      return await apiClient.collaborationApi.updateProject(project.cloud.id, project.id, project);
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_UPDATE_ERROR, error);
    }
  }

  async deleteProject(project) {
    try {
      return await apiClient.collaborationApi.deleteProject(project.cloud.id, project.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_DELETE_ERROR, error);
    }
  }

  async sendProjectInvitation(project, invitation) {
    try {
      return await apiClient.collaborationApi.inviteProjectUser(project.cloud.id, project.id, {
        email: invitation.email,
        role: invitation.role,
        redirect_uri: `${ENV.VUE_APP_BASE_URL}/invitations`,
      });
    } catch (error) {
      if (error.status === 400 && (await error.json()).already_exists) {
        throw new RuntimeError(ERRORS.USER_ALREADY_EXISTS_ERROR, error);
      } else {
        throw new RuntimeError(ERRORS.INVITATION_SEND_ERROR, error);
      }
    }
  }

  async cancelProjectInvitation(project, invitation) {
    try {
      return await apiClient.collaborationApi.cancelProjectUserInvitation(
        project.cloud.id,
        invitation.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_CANCEL_ERROR, error);
    }
  }

  async updateProjectUser(project, user) {
    try {
      return await apiClient.collaborationApi.updateProjectUser(
        project.cloud.id,
        user.id,
        project.id,
        { role: user.role }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_UPDATE_ERROR, error);
    }
  }

  async deleteProjectUser(project, user) {
    try {
      return await apiClient.collaborationApi.deleteProjectUser(
        project.cloud.id,
        user.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_DELETE_ERROR, error);
    }
  }

  async leaveProject(project) {
    try {
      return await apiClient.collaborationApi.leaveProject(project.cloud.id, project.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_LEAVE_ERROR, error);
    }
  }

  async fetchFolderProjectUsers(project, folder) {
    try {
      return await apiClient.collaborationApi.getFolderProjectUsers(
        project.cloud.id,
        folder.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.USERS_PROJECT_FETCH_ERROR, error);
    }
  }

  async getProjectFolderTree(project) {
    try {
      return await apiClient.collaborationApi.getProjectFolderTree(project.cloud.id, project.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_FOLDER_TREE_FETCH_ERROR, error);
    }
  }

  async fetchProjectNotification(spaceId, projectId) {
    let res;
    try {
      res = await backendClient.get(`/cloud/${spaceId}/project/${projectId}/notification`);
    } catch (error) {
      if(error.status === 404) {
        res = null; // No notification found
      } else {
        console.error("Error fetching project notification:", error);
      }
    }
    return res;
  }
  updateProjectNotification(spaceId, projectId, notification) {
    return backendClient.put(`/cloud/${spaceId}/project/${projectId}/notification`, notification);
  }
  deleteProjectNotification(spaceId, projectId) {
    return backendClient.delete(`/cloud/${spaceId}/project/${projectId}/notification`);
  }
}

const service = new ProjectService();

export default service;
