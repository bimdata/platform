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
      role => role.cloud === project.id && role.role === 100
    )
  }));
  return state.userProjects;
};

const loadSpaceProjects = async space => {
  state.spaceProjects = await ProjectService.fetchSpaceProjects(space);
  return state.spaceProjects;
};

const createProject = async (space, project) => {
  const newProject = await ProjectService.createProject(space, project);
  state.spaceProjects = [newProject].concat(state.spaceProjects);
  return newProject;
};

const updateProject = async project => {
  const newProject = await ProjectService.updateProject(project);
  softUpdateProject(newProject);
  return newProject;
};

const softUpdateProject = project => {
  state.spaceProjects = state.spaceProjects.map(p =>
    p.id === project.id ? project : p
  );
};

const deleteProject = async project => {
  await ProjectService.deleteProject(project);
  state.spaceProjects = state.spaceProjects.filter(p => p.id !== project.id);
  return project;
};

const selectProject = id => {
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
    selectProject,
    fetchProjectPreviewImages
  };
}
