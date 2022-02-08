/* eslint-disable */
import { load } from "@/components/specific/app/app-loading/app-loading.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";

const spaces = useSpaces();
const projects = useProjects();

export default async function spaceBoardResolver(route) {
  const space = spaces.setCurrentSpace(+route.params.spaceID);

  spaces.loadSpaceSubInfo(space);

  load("space-users", [
    spaces.loadSpaceUsers(space),
    spaces.loadSpaceInvitations(space)
  ]);
  load("space-projects", [
    projects.loadSpaceProjects(space)
  ]);
}
