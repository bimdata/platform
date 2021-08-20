import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { createViewResolver } from "./view-resolver";

const groupBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const groups = useGroups();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await projects.loadProjectUsers(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  groups.selectGroup(+route.params.groupID);
});

export default groupBoardResolver;
