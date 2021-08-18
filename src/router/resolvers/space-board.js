import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { createViewResolver } from "./view-resolver";

const spaceBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  await spaces.loadSpaceUsers(spaces.currentSpace.value);
  await spaces.loadSpaceInvitations(spaces.currentSpace.value);
});

export default spaceBoardResolver;
