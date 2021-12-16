import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();
const models = useModels();

export default async function modelViewerResolver(route) {
  spaces.setCurrentSpace(+route.params.spaceID);
  await projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.setCurrentProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
}
