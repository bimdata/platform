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
            firstname: "Gaëlle",
            lastname: "Leroux"
          },
          {
            firstname: "Gaëtan",
            lastname: "Lagier"
          },
          {
            firstname: "Hugo",
            lastname: "Duroux"
          },
          {
            firstname: "Nicolas",
            lastname: "Richel"
          },
          {
            firstname: "François",
            lastname: "Thierry"
          }
        ]
      }
    ];
  }

  createGroup(project, group) {
    return group;
  }

  updateGroup(project, group) {
    return group;
  }

  deleteGroup(project, group) {
    return group;
  }
}

const service = new GroupService();

export default service;
