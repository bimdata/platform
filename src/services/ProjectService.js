import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";
import ModelService from "./ModelService";

class ProjectService {
  constructor() {
    this.cache = {
      modelPreviews: new Map()
    };
  }

  fetchUserProjects() {
    try {
      return apiClient.collaborationApi.getSelfProjects();
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  fetchSpaceProjects(space) {
    try {
      return apiClient.collaborationApi.getProjects({
        cloudPk: space.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.PROJECTS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  fetchProjectByID(space, id) {
    try {
      return apiClient.collaborationApi.getProject({
        cloudPk: space.id,
        id
      });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  fetchProjectUsers(project) {
    try {
      return apiClient.collaborationApi.getProjectUsers({
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

  fetchProjectInvitations(project) {
    try {
      return apiClient.collaborationApi.getProjectInvitations({
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

  async fetchProjectModelPreviews(project) {
    const cacheKey = `${project.cloud.id}-${project.id}`;
    if (this.cache.modelPreviews.has(cacheKey)) {
      return this.cache.modelPreviews.get(cacheKey);
    } else {
      const models = await ModelService.fetchModels(project);
      const previews = models
        .filter(model => model.viewer360File)
        .map(model => ({
          id: model.id,
          url: model.viewer360File
        }));
      this.cache.modelPreviews.set(cacheKey, previews);
      return previews;
    }
  }

  createProject(space, project) {
    try {
      return apiClient.collaborationApi.createProject({
        cloudPk: space.id,
        data: project
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_CREATE_ERROR, error);
    }
  }

  updateProject(project) {
    try {
      return apiClient.collaborationApi.updateProject({
        cloudPk: project.cloud.id,
        id: project.id,
        data: project
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_UPDATE_ERROR, error);
    }
  }

  deleteProject(project) {
    try {
      return apiClient.collaborationApi.deleteProject({
        cloudPk: project.cloud.id,
        id: project.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.PROJECT_DELETE_ERROR, error);
    }
  }

  sendProjectInvitation(project, invitation) {
    try {
      return apiClient.collaborationApi.inviteProjectUser({
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

  cancelProjectInvitation(project, invitation) {
    try {
      return apiClient.collaborationApi.cancelProjectUserInvitation({
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

  deleteProjectUser(project, user) {
    try {
      return apiClient.collaborationApi.deleteProjectUser({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: user.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_DELETE_ERROR, error);
    }
  }
}

const service = new ProjectService();

export default service;
