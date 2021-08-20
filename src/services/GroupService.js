import apiClient from "./api-client";
import { ERRORS, RuntimeError, ErrorService } from "./ErrorService";

class GroupService {
  fetchProjectGroups(project) {
    try {
      return apiClient.collaborationApi.getManageGroups({
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

  fetchUserGroups(project) {
    try {
      return apiClient.collaborationApi.getGroups({
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

  createGroup(project, group) {
    try {
      return apiClient.collaborationApi.createManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        data: group
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_CREATE_ERROR, error);
    }
  }

  updateGroup(project, group) {
    try {
      return apiClient.collaborationApi.updateManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: group.id,
        data: group
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_UPDATE_ERROR, error);
    }
  }

  deleteGroup(project, group) {
    try {
      return apiClient.collaborationApi.deleteManageGroup({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        id: group.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.GROUP_DELETE_ERROR, error);
    }
  }

  addGroupMembers(project, group, users) {
    try {
      return Promise.all(
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

  removeGroupMembers(project, group, users) {
    try {
      return Promise.all(
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

  updateGroupPermission(project, folder, group, permission) {
    try {
      return apiClient.collaborationApi.updateGroupFolder({
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
