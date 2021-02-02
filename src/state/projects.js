import { reactive, readonly, toRefs } from "vue";
import IfcService from "@/api/IfcService";
import ProjectsService from "@/api/ProjectService";

const state = reactive({
  projects: [],
  currentProject: null
});

const fetchProjects = async space => {
  const projects = await ProjectsService.fetchSpaceProjects(space);
  state.projects = projects;
  return projects;
};

const createProject = async (space, project) => {
  const newProject = await ProjectsService.createProject(space, project);
  state.projects = [newProject].concat(state.projects);
  return newProject;
};

const updateProject = async (space, project) => {
  const newProject = await ProjectsService.updateProject(space, project);
  softUpdateProject(newProject);
  return newProject;
};

const softUpdateProject = project => {
  state.projects = state.projects.map(p => (p.id === project.id ? project : p));
};

const deleteProject = async (space, project) => {
  await ProjectsService.deleteProject(space, project);
  state.projects = state.projects.filter(p => p.id !== project.id);
  return project;
};

const selectProject = id => {
  state.currentProject = state.projects.find(p => p.id === id) || null;
  return state.currentProject;
};

const fetchProjectPreviewImage = async (space, project) => {
  let ifcs = await IfcService.fetchProjectIfcs(space, project);
  ifcs = ifcs.filter(ifc => ifc.viewer_360_file);
  ifcs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return ifcs.length ? ifcs[0].viewer_360_file : null;
};

export function useProjects() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    fetchProjects,
    createProject,
    updateProject,
    softUpdateProject,
    deleteProject,
    selectProject,
    fetchProjectPreviewImage
  };
}
