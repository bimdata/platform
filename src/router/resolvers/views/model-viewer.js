import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();

  spaces.setCurrentSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.setCurrentProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
});
