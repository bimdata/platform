import { reactive, readonly, toRefs } from "vue";
import IfcService from "@/api/IfcService";
import ProjectsService from "@/api/ProjectService";

const state = reactive({
  loaded: false,
  projects: [],
  currentProject: null
});

const loadProjects = async (space, options = {}) => {
  if (!state.loaded || options.forceFetch) {
    state.projects = await ProjectsService.fetchSpaceProjects(space);
    state.loaded = true;
  }
  return state.projects;
};

const createProject = async (space, project) => {
  const newProject = await ProjectsService.createProject(space, project);
  state.projects = [newProject].concat(state.projects);
  return newProject;
};

const updateProject = async project => {
  const newProject = await ProjectsService.updateProject(project);
  softUpdateProject(newProject);
  return newProject;
};

const softUpdateProject = project => {
  state.projects = state.projects.map(p => (p.id === project.id ? project : p));
};

const deleteProject = async project => {
  await ProjectsService.deleteProject(project);
  state.projects = state.projects.filter(p => p.id !== project.id);
  return project;
};

const selectProject = id => {
  state.currentProject = state.projects.find(p => p.id === id) || null;
  return state.currentProject;
};

const fetchProjectPreviewImage = async project => {
  let ifcs = await IfcService.fetchProjectIfcs(project);
  ifcs = ifcs.filter(ifc => ifc.viewer360File);
  ifcs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const imageURL = ifcs.length ? ifcs[0].viewer360File : null;
  return imageURL;
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadProjects,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    selectProject,
    fetchProjectPreviewImage
  };
}
