import { useGroups } from "@/state/groups.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useFiles } from "@/state/files.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();
  const files = useFiles();
  const groups = useGroups();

  spaces.setCurrentSpace(+route.params.spaceID);
  await spaces.loadSpaceInfo(spaces.currentSpace.value);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
  await files.loadProjectFileStructure(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  await projects.loadProjectUsers(projects.currentProject.value);
  await projects.loadProjectInvitations(projects.currentProject.value);
});
