import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();

  spaces.setCurrentSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  await spaces.loadSpaceInfo(spaces.currentSpace.value);
  await spaces.loadSpaceUsers(spaces.currentSpace.value);
  await spaces.loadSpaceInvitations(spaces.currentSpace.value);
});
