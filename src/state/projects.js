import { reactive, readonly, toRefs } from "vue";
import IfcService from "@/server/IfcService";
import ProjectService from "@/server/ProjectService";
import { useUser } from "@/state/user";

const state = reactive({
  userProjects: [],
  spaceProjects: [],
  currentProject: null
});

const loadUserProjects = async () => {
  const { user } = useUser();
  const projects = await ProjectService.fetchUserProjects();
  state.userProjects = projects.map(project => ({
    ...project,
    isAdmin: user.value.projects.some(
      role => role.project === project.id && role.role === 100
    )
  }));
  state.userProjects = state.userProjects
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return state.userProjects;
};

const loadSpaceProjects = async space => {
  const { user } = useUser();
  const projects = await ProjectService.fetchSpaceProjects(space);
  state.spaceProjects = projects.map(project => ({
    ...project,
    isAdmin: user.value.projects.some(
      role => role.project === project.id && role.role === 100
    )
  }));
  state.spaceProjects = state.spaceProjects
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return state.spaceProjects;
};

const createProject = async (space, project) => {
  const newProject = await ProjectService.createProject(space, project);
  state.userProjects = [newProject].concat(state.userProjects);
  state.spaceProjects = [newProject].concat(state.spaceProjects);
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
  state.spaceProjects = state.spaceProjects.map(p =>
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
  state.spaceProjects = state.spaceProjects.filter(p => p.id !== project.id);
  return project;
};

const selectUserProject = id => {
  state.currentProject = state.userProjects.find(p => p.id === id) || null;
  return state.currentProject;
};

const selectSpaceProject = id => {
  state.currentProject = state.spaceProjects.find(p => p.id === id) || null;
  return state.currentProject;
};

const fetchProjectPreviewImages = async project => {
  const ifcs = await IfcService.fetchProjectIfcs(project);
  const images = ifcs
    .filter(ifc => ifc.viewer360File)
    .map(ifc => ifc.viewer360File);
  return images;
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadUserProjects,
    loadSpaceProjects,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    softDeleteProject,
    selectUserProject,
    selectProject: selectSpaceProject,
    fetchProjectPreviewImages
  };
}
