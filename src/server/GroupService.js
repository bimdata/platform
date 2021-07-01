import apiClient from "./api-client";

class GroupService {
  fetchProjectGroups(project) {
    return [
      {
        id: 1,
        name: "My Group Name",
        color: "#FF3D1E",
        project,
        members: [
          {
            id: 1230,
            firstname: "Gaëlle",
            lastname: "Leroux",
            email: "gaelle@bimdata.io"
          },
          {
            id: 1231,
            firstname: "Gaëtan",
            lastname: "Lagier",
            email: "gaetan@bimdata.io"
          },
          {
            id: 1232,
            firstname: "Hugo",
            lastname: "Duroux",
            email: "hugo@bimdata.io"
          },
          {
            id: 1234,
            firstname: "Nicolas",
            lastname: "Richel",
            email: "nicolas@bimdata.io"
          },
          {
            id: 1235,
            firstname: "François",
            lastname: "Thierry",
            email: "francois@bimdata.io"
          }
        ]
      }
    ];
    // return apiClient.getManageGroups({
    //   cloudPk: project.cloud.id,
    //   projectPk: project.id
    // });
  }

  createGroup(project, group) {
    return group;
    // return apiClient.createManageGroup({
    //   cloudPk: project.cloud.id,
    //   projectPk: project.id,
    //   data: group
    // });
  }

  updateGroup(project, group) {
    return group;
    // return apiClient.updateManageGroup({
    //   cloudPk: project.cloud.id,
    //   projectPk: project.id,
    //   id: group.id,
    //   data: group
    // });
  }

  deleteGroup(project, group) {
    return group;
    // return apiClient.deleteManageGroup({
    //   cloudPk: project.cloud.id,
    //   projectPk: project.id,
    //   id: group.id
    // });
  }

  addGroupMembers(project, group, users) {
    return users;
    // return Promise.all(
    //   users.map(
    //     user => apiClient.addGroupMember({
    //       cloudPk: project.cloud.id,
    //       projectPk: project.id,
    //       groupPk: group.id,
    //       data: {
    //         userId: user.id
    //       }
    //     })
    //   )
    // );
  }

  removeGroupMembers(project, group, users) {
    return users;
    // return Promise.all(
    //   users.map(
    //     user => apiClient.deleteGroupMember({
    //       cloudPk: project.cloud.id,
    //       projectPk: project.id,
    //       groupPk: group.id,
    //       id: user.id
    //     })
    //   )
    // );
  }
}

const service = new GroupService();

export default service;
