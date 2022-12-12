import { reactive, readonly, toRefs } from "vue";
import ProjectService from "../services/ProjectService.js";
import { fullName } from "../utils/users.js";

import { mapProjects, mapUsers } from "./mappers.js";
import { useUser } from "./user.js";

const state = reactive({
  userProjects: [],
  spaceProjects: [],
  currentProject: null,
  projectUsers: [],
  projectInvitations: []
});

const setCurrentProject = id => {
  state.currentProject = state.userProjects.find(p => p.id === id) || null;
  return readonly(state.currentProject);
};

const loadUserProjects = async () => {
  const projects = await ProjectService.fetchUserProjects();
  state.userProjects = mapProjects(projects);
  return projects;
};

const loadSpaceProjects = async space => {
  const projects = await ProjectService.fetchSpaceProjects(space);
  state.spaceProjects = mapProjects(projects);
  return projects;
};

const loadProjectUsers = async project => {
  const users = await ProjectService.fetchProjectUsers(project);
  state.projectUsers = mapUsers(users);
  return users;
};

const loadProjectInvitations = async project => {
  let invitations = [];
  if (project.isAdmin) {
    invitations = await ProjectService.fetchProjectInvitations(project);
  }
  state.projectInvitations = invitations;
  return invitations;
};

const createProject = async (space, project) => {
  const newProject = await ProjectService.createProject(space, project);

  const { loadUser } = useUser();
  await loadUser();
  await loadUserProjects();
  await loadSpaceProjects(space);

  return newProject;
};

const updateProject = async project => {
  const newProject = await ProjectService.updateProject(project);

  await loadUserProjects();
  await loadSpaceProjects({ id: project.cloud.id });

  return newProject;
};

const deleteProject = async project => {
  await ProjectService.deleteProject(project);

  const { loadUser } = useUser();
  await loadUser();
  await loadUserProjects();
  await loadSpaceProjects({ id: project.cloud.id });

  return project;
};

const leaveProject = async project => {
  await ProjectService.leaveProject(project);

  const { loadUser } = useUser();
  await loadUser();
  await loadUserProjects();
  await loadSpaceProjects({ id: project.cloud.id });

  return project;
};

const sendProjectInvitation = async (project, invitation, options = {}) => {
  const newInvitation = await ProjectService.sendProjectInvitation(
    project,
    invitation
  );
  if (!options.resend) {
    state.projectInvitations = [newInvitation].concat(state.projectInvitations);
  }
  return newInvitation;
};

const cancelProjectInvitation = async (project, invitation) => {
  await ProjectService.cancelProjectInvitation(project, invitation);
  state.projectInvitations = state.projectInvitations.filter(
    i => i.id !== invitation.id
  );
  return invitation;
};

const updateProjectUser = async (project, user) => {
  const newUser = await ProjectService.updateProjectUser(project, user);
  state.projectUsers = state.projectUsers.map(u =>
    u.id === user.id ? { ...u, ...newUser } : u
  );
  return newUser;
};

const deleteProjectUser = async (project, user) => {
  await ProjectService.deleteProjectUser(project, user);
  state.projectUsers = state.projectUsers.filter(u => u.id !== user.id);
  return user;
};

const fetchFolderProjectUsers = async (project, folder) => {
  let users = await ProjectService.fetchFolderProjectUsers(project, folder);
  users = mapUsers(users);
  return users;
};

const getUserProjectList = async (project, folder) => {
  const users = await fetchFolderProjectUsers(project, folder);
  return users
    .filter(({ isSelf }) => !isSelf)
    .map(user => ({
      ...user,
      fullName: fullName(user),
      hasAccess: user.permission >= 50,
      isFindable: true,
      searchContent: `${user.firstname || ""} ${user.lastname || ""} ${
        user.email || ""
      }`.toLowerCase()
    }));
};

const fetchProjectFolderTreeSerializers = async project => {
  return (
    await ProjectService.fetchProjectFolderTreeSerializers(project)
  ).filter(p => p.name !== project.name);
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    setCurrentProject,
    loadUserProjects,
    loadSpaceProjects,
    loadProjectUsers,
    loadProjectInvitations,
    createProject,
    updateProject,
    deleteProject,
    leaveProject,
    sendProjectInvitation,
    cancelProjectInvitation,
    updateProjectUser,
    deleteProjectUser,
    fetchFolderProjectUsers,
    getUserProjectList,
    fetchProjectFolderTreeSerializers
  };
}
