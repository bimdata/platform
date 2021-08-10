import apiClient from "./api-client";

class GroupService {
  fetchProjectGroups(project) {
    return apiClient.collaborationApi.getManageGroups({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  fetchUserGroups(project) {
    return apiClient.collaborationApi.getGroups({
      cloudPk: project.cloud.id,
      projectPk: project.id
    });
  }

  createGroup(project, group) {
    return apiClient.collaborationApi.createManageGroup({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      data: group
    });
  }

  updateGroup(project, group) {
    return apiClient.collaborationApi.updateManageGroup({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: group.id,
      data: group
    });
  }

  deleteGroup(project, group) {
    return apiClient.collaborationApi.deleteManageGroup({
      cloudPk: project.cloud.id,
      projectPk: project.id,
      id: group.id
    });
  }

  addGroupMembers(project, group, users) {
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
  }

  removeGroupMembers(project, group, users) {
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
  }
}

const service = new GroupService();

export default service;
