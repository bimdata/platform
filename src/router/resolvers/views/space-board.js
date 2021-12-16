import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();

export default async function spaceBoardResolver(route) {
  spaces.setCurrentSpace(+route.params.spaceID);

  await projects.loadSpaceProjects(spaces.currentSpace.value);
  await spaces.loadSpaceInfo(spaces.currentSpace.value);
  await spaces.loadSpaceUsers(spaces.currentSpace.value);
  await spaces.loadSpaceInvitations(spaces.currentSpace.value);
}
