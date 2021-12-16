import { useGroups } from "@/state/groups.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();
const groups = useGroups();

export default async function groupBoardResolver(route) {
  spaces.setCurrentSpace(+route.params.spaceID);
  await projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.setCurrentProject(+route.params.projectID);
  await projects.loadProjectUsers(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  groups.setCurrentGroup(+route.params.groupID);
}
