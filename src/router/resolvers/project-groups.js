import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { createViewResolver } from "./view-resolver";

const projectGroupsResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const groups = useGroups();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await groups.loadProjectGroups(projects.currentProject.value);
});

export default projectGroupsResolver;
