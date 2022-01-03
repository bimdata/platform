import { useGroups } from "@/state/groups.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();
const groups = useGroups();

export default async function projectBoardResolver(route) {
  spaces.setCurrentSpace(+route.params.spaceID);
  const project = projects.setCurrentProject(+route.params.projectID);

  await groups.loadProjectGroups(project);
}
