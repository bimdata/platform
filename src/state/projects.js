import { reactive, readonly, toRefs, watch } from "vue";
import ProjectService from "@/services/ProjectService";
import { useUser } from "@/state/user";
import { projectStatus } from "@/utils/projects.js";

const state = reactive({
  userProjects: [],
  spaceProjects: [],
  currentProject: null,
  projectUsers: [],
  projectInvitations: []
});

const loadUserProjects = async () => {
  const { mapProjects } = useUser();
  let projects = await ProjectService.fetchUserProjects();
  projects = mapProjects(projects);
  projects.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.userProjects = projects;
  return projects;
};

let unwatchUserProjects = () => {};
const loadSpaceProjects = space => {
  unwatchUserProjects();
  unwatchUserProjects = watch(
    () => state.userProjects,
    () => {
      state.spaceProjects = state.userProjects.filter(
        project => project.cloud.id === space.id
      );
    },
    { immediate: true }
  );
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
  state.userProjects = [
    {
      ...newProject,
      isAdmin: true,
      projectStatus: projectStatus(newProject)
    }
  ].concat(state.userProjects);

  return newProject;
};

const updateProject = async project => {
  const newProject = await ProjectService.updateProject(project);
  softUpdateProject(newProject);
  return newProject;
};

const softUpdateProject = project => {
  state.userProjects = state.userProjects.map(p =>
    p.id === project.id ? { ...p, ...project } : p
  );
  return project;
};

const deleteProject = async project => {
  await ProjectService.deleteProject(project);
  softDeleteProject(project);
  return project;
};

const softDeleteProject = project => {
  state.userProjects = state.userProjects.filter(p => p.id !== project.id);
  return project;
};

const selectProject = id => {
  state.currentProject = state.userProjects.find(p => p.id === id) || null;
  return readonly(state.currentProject);
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

const leaveProject = async project => {
  await ProjectService.leaveProject(project);
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUserProjects,
    loadSpaceProjects,
    loadProjectUsers,
    loadProjectInvitations,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    softDeleteProject,
    selectProject,
    sendProjectInvitation,
    cancelProjectInvitation,
    updateProjectUser,
    deleteProjectUser,
    leaveProject
  };
}
