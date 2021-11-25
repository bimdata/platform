import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";
import ModelService from "./ModelService";

class ProjectService {
  async fetchUserProjects() {
    try {
      return await apiClient.collaborationApi.getSelfProjects();
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchSpaceProjects(space) {
    try {
      return await apiClient.collaborationApi.getProjects({
        cloudPk: space.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchProjectByID(space, id) {
    try {
      return await apiClient.collaborationApi.getProject({
        cloudPk: space.id,
        id
      });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async fetchProjectUsers(project) {
    try {
      return await apiClient.collaborationApi.getProjectUsers({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.USERS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchProjectInvitations(project) {
    try {
      return await apiClient.collaborationApi.getProjectInvitations({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.INVITATIONS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async createProject(space, project) {
    try {
      return await apiClient.collaborationApi.createProject({
        cloudPk: space.id,
        data: project
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_CREATE_ERROR, error);
    }
  }

  async updateProject(project) {
    try {
      return await apiClient.collaborationApi.updateProject({
        cloudPk: project.cloud.id,
        id: project.id,
        data: project
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_UPDATE_ERROR, error);
    }
  }

  async deleteProject(project) {
    try {
      return await apiClient.collaborationApi.deleteProject({
        cloudPk: project.cloud.id,
        id: project.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_DELETE_ERROR, error);
    }
  }

  async sendProjectInvitation(project, invitation) {
    try {
      return await apiClient.collaborationApi.inviteProjectUser({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        data: {
          email: invitation.email,
          role: invitation.role,
          redirectUri: `${process.env.VUE_APP_BASE_URL}/spaces/${project.cloud.id}/projects/${project.id}`
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_SEND_ERROR, error);
    }
  }

  async cancelProjectInvitation(project, invitation) {
    try {
      return await apiClient.collaborationApi.cancelProjectUserInvitation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: invitation.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_CANCEL_ERROR, error);
    }
  }

  async updateProjectUser(project, user) {
    try {
      // TODO: API model should be updated to return
      // user data instead of role value.
      await apiClient.collaborationApi.updateProjectUser({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: user.id,
        data: user
      });
      return {
        ...user,
        role: undefined
      };
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_UPDATE_ERROR, error);
    }
  }

  async deleteProjectUser(project, user) {
    try {
      return await apiClient.collaborationApi.deleteProjectUser({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: user.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_DELETE_ERROR, error);
    }
  }

  async leaveProject(project) {
    try {
      return await apiClient.collaborationApi.leaveProject({
        cloudPk: project.cloud.id,
        id: project.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_LEAVE_ERROR, error);
    }
  }
}

const service = new ProjectService();

export default service;
