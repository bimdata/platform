import apiClient from "./api-client.js";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService.js";

class GroupService {
  async fetchProjectGroups(project) {
    try {
      return await apiClient.collaborationApi.getManageGroups(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.GROUPS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchUserGroups(project) {
    try {
      return await apiClient.collaborationApi.getGroups(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.GROUPS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchGroupByID(project, id) {
    try {
      return await apiClient.collaborationApi.getManageGroup(
        project.cloud.id,
        id,
        project.id
      );
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async createGroup(project, group) {
    try {
      return await apiClient.collaborationApi.createManageGroup(
        project.cloud.id,
        project.id,
        group
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_CREATE_ERROR, error);
    }
  }

  async updateGroup(project, group) {
    try {
      return await apiClient.collaborationApi.updateManageGroup(
        project.cloud.id,
        group.id,
        project.id,
        group
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async deleteGroup(project, group) {
    try {
      return await apiClient.collaborationApi.deleteManageGroup(
        project.cloud.id,
        group.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_DELETE_ERROR, error);
    }
  }

  async addGroupMembers(project, group, users) {
    try {
      return await Promise.all(
        users.map(user =>
          apiClient.collaborationApi.addGroupMember(
            project.cloud.id,
            group.id,
            project.id,
            {
              userproject_id: user.id
            }
          )
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async removeGroupMembers(project, group, users) {
    try {
      await Promise.all(
        users.map(user =>
          apiClient.collaborationApi.deleteGroupMember(
            project.cloud.id,
            group.id,
            user.id,
            project.id
          )
        )
      );
      return users;
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async updateGroupPermission(project, folder, group, permission) {
    try {
      return await apiClient.collaborationApi.updateGroupFolder(
        project.cloud.id,
        folder.id,
        group.id,
        project.id,
        {
          permission
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }
}

const service = new GroupService();

export default service;
