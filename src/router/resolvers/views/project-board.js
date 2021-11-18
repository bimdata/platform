import { useGroups } from "@/state/groups.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useFiles } from "@/state/files.js";

const spaces = useSpaces();
const projects = useProjects();
const models = useModels();
const files = useFiles();
const groups = useGroups();

export default async function projectBoardResolver(route) {
  spaces.setCurrentSpace(+route.params.spaceID);
  await spaces.loadSpaceInfo(spaces.currentSpace.value);
  await projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.setCurrentProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
  await files.loadProjectFileStructure(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  await projects.loadProjectUsers(projects.currentProject.value);
  await projects.loadProjectInvitations(projects.currentProject.value);
}
