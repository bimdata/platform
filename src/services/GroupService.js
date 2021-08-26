import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";

class GroupService {
  async fetchProjectGroups(project) {
    try {
      return await apiClient.collaborationApi.getManageGroups({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.GROUPS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchUserGroups(project) {
    try {
      return await apiClient.collaborationApi.getGroups({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.GROUPS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchGroupByID(project, id) {
    try {
      return await apiClient.collaborationApi.getManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id
      });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async createGroup(project, group) {
    try {
      return await apiClient.collaborationApi.createManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        data: group
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_CREATE_ERROR, error);
    }
  }

  async updateGroup(project, group) {
    try {
      return await apiClient.collaborationApi.updateManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: group.id,
        data: group
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async deleteGroup(project, group) {
    try {
      return await apiClient.collaborationApi.deleteManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: group.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_DELETE_ERROR, error);
    }
  }

  async addGroupMembers(project, group, users) {
    try {
      return await Promise.all(
        users.map(user =>
          apiClient.collaborationApi.addGroupMember({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            groupPk: group.id,
            data: {
              userId: user.id
            }
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async removeGroupMembers(project, group, users) {
    try {
      return await Promise.all(
        users.map(user =>
          apiClient.collaborationApi.deleteGroupMember({
            cloudPk: project.cloud.id,
            projectPk: project.id,
            groupPk: group.id,
            id: user.id
          })
        )
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  async updateGroupPermission(project, folder, group, permission) {
    try {
      return await apiClient.collaborationApi.updateGroupFolder({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        folderPk: folder.id,
        id: group.id,
        data: {
          permission
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }
}

const service = new GroupService();

export default service;
