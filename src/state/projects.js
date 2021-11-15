import { reactive, readonly, toRefs } from "vue";
import ProjectService from "@/services/ProjectService.js";
import { useUser } from "@/state/user.js";

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
  let projects = await ProjectService.fetchUserProjects();
  const { mapProjects } = useUser();
  projects = mapProjects(projects);
  projects.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.userProjects = projects;
  return projects;
};

const loadSpaceProjects = async space => {
  let projects = await ProjectService.fetchSpaceProjects(space);
  const { mapProjects } = useUser();
  projects = mapProjects(projects);
  projects.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.spaceProjects = projects;
  return projects;
};

const loadProjectUsers = async project => {
  const { mapUsers } = useUser();
  let users = [];
  users = await ProjectService.fetchProjectUsers(project);
  users = mapUsers(users);
  users.sort((a, b) =>
    `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
  );
  state.projectUsers = users;
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
    sendProjectInvitation,
    cancelProjectInvitation,
    updateProjectUser,
    deleteProjectUser
  };
}
