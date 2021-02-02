import { reactive, readonly, toRefs } from 'vue';
import ProjectsService from '@/api/ProjectService';

const state = reactive({
  projects: [],
  currentProject: null,
});

const fetchProjects = async (space) => {
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

const softUpdateProject = (project) => {
  state.projects = state.projects.map(p => p.id === project.id ? project : p);
};

const deleteProject = async (space, project) => {
  await ProjectsService.deleteProject(space, project);
  state.projects = state.projects.filter(p => p.id !== project.id);
  return project;
};

const selectProject = (id) => {
  state.currentProject = state.projects.find(p => p.id === id) || null;
  return state.currentProject;
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
  };
}
