import { reactive, readonly, toRefs, watchEffect } from "vue";
import ProjectService from "@/server/ProjectService";
import { useUser } from "@/state/user";
import { PROJECT_ROLE } from "@/utils/users";

const state = reactive({
  userProjects: [],
  spaceProjects: [],
  currentProject: null,
  currentProjectUsers: [],
  currentProjectInvitations: []
});

const loadUserProjects = async () => {
  const { user } = useUser();
  let projects = await ProjectService.fetchUserProjects();
  projects = projects.map(project => ({
    ...project,
    isAdmin: user.value.projects.some(
      role => role.project === project.id && role.role === PROJECT_ROLE.ADMIN
    )
  }));
  projects = projects
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.userProjects = projects;
  return projects;
};

let stopSpaceProjectsWatcher;
const loadSpaceProjects = space => {
  if (typeof stopSpaceProjectsWatcher === "function") {
    stopSpaceProjectsWatcher();
  }
  stopSpaceProjectsWatcher = watchEffect(() => {
    state.spaceProjects = state.userProjects.filter(
      project => project.cloud.id === space.id
    );
  });
};

const loadProjectUsers = async project => {
  const { user: currentUser } = useUser();
  let users = await ProjectService.fetchProjectUsers(project);
  users = users.map(user => ({
    ...user,
    isSelf: user.id === currentUser.value.id
  }));
  state.currentProjectUsers = users;
  return users;
};

const loadProjectInvitations = async project => {
  const invitations = await ProjectService.fetchProjectInvitations(project);
  state.currentProjectInvitations = invitations;
  return invitations;
};

const loadProjectModelPreviews = async project => {
  const previews = await ProjectService.fetchProjectModelPreviews(project);
  return previews;
};

const createProject = async (space, project) => {
  const newProject = await ProjectService.createProject(space, project);
  state.userProjects = [{ ...newProject, isAdmin: true }].concat(
    state.userProjects
  );
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
    state.currentProjectInvitations = [newInvitation].concat(
      state.currentProjectInvitations
    );
  }
  return newInvitation;
};

const cancelProjectInvitation = async (project, invitation) => {
  await ProjectService.cancelProjectInvitation(project, invitation);
  state.currentProjectInvitations = state.currentProjectInvitations.filter(
    i => i.id !== invitation.id
  );
  return invitation;
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadUserProjects,
    loadSpaceProjects,
    loadProjectUsers,
    loadProjectInvitations,
    loadProjectModelPreviews,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    softDeleteProject,
    selectProject,
    sendProjectInvitation,
    cancelProjectInvitation
  };
}
