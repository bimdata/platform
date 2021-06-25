import apiClient from "./api-client";

class GroupService {
  fetchProjectGroups(project) {
    return [
      // {
      //   id: 1,
      //   name: "My Group Name",
      //   color: "#FF3D1E",
      //   project,
      //   members: [
      //     {
      //       id: 1230,
      //       firstname: "Gaëlle",
      //       lastname: "Leroux",
      //       email: "gaelle@bimdata.io"
      //     },
      //     {
      //       id: 1231,
      //       firstname: "Gaëtan",
      //       lastname: "Lagier",
      //       email: "gaetan@bimdata.io"
      //     },
      //     {
      //       id: 1232,
      //       firstname: "Hugo",
      //       lastname: "Duroux",
      //       email: "hugo@bimdata.io"
      //     },
      //     {
      //       id: 1234,
      //       firstname: "Nicolas",
      //       lastname: "Richel",
      //       email: "nicolas@bimdata.io"
      //     },
      //     {
      //       id: 1235,
      //       firstname: "François",
      //       lastname: "Thierry",
      //       email: "francois@bimdata.io"
      //     }
      //   ]
      // }
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
