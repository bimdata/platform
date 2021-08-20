import { useGroups } from "@/state/groups";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { useFiles } from "@/state/files";
import { createViewResolver } from "./view-resolver";

const projectBoardResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();
  const files = useFiles();
  const groups = useGroups();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
  await files.loadProjectFileStructure(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  await projects.loadProjectUsers(projects.currentProject.value);
  await projects.loadProjectInvitations(projects.currentProject.value);
});

export default projectBoardResolver;
