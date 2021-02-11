import { reactive, readonly, toRefs } from "vue";
import IfcService from "@/server/IfcService";
import ProjectsService from "@/server/ProjectService";

const state = reactive({
  projects: [],
  currentProject: null
});

const loadProjects = async (space, options = {}) => {
  state.projects = await ProjectsService.fetchSpaceProjects(space, options);
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
    loadProjects,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    selectProject,
    fetchProjectPreviewImages
  };
}
