import { reactive, readonly, toRefs } from 'vue';
import ProjectsService from '@/api/ProjectsService';

const state = reactive({
  projects: [],
  currentProject: null,
});

const fetchProjects = (space) => {
  return ProjectsService.fetchSpaceProjects(space).then(
    projects => state.projects = projects
  );
};

const createProject = (space, project) => {
  return ProjectsService.createProject(space, project).then(
    newProject => state.projects = [newProject].concat(state.projects)
  );
};

const updateProject = (space, project) => {
  return ProjectsService.updateProject(space, project).then(softUpdateProject);
};

const softUpdateProject = (project) => {
  state.projects = state.projects.map(p => p.id === project.id ? project : p);
};

const deleteProject = (space, project) => {
  return ProjectsService.deleteProject(space, project).then(
    () => state.projects = state.projects.filter(p => p.id !== project.id)
  );
};

const selectProject = (id) => {
  state.currentProject = state.projects.find(p => p.id === id) || null;
};

export function useProjectsState() {
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
