import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();
const models = useModels();

export default async function modelViewerResolver(route) {
  const space = spaces.setCurrentSpace(+route.params.spaceID);
  const project = projects.setCurrentProject(+route.params.projectID);

  await Promise.all([
    projects.loadSpaceProjects(space),
    models.loadProjectModels(project)
  ]);
}
