import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
import { createViewResolver } from "./view-resolver";

const modelViewerResolver = createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const models = useModels();

  spaces.selectSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.selectProject(+route.params.projectID);
  await models.loadProjectModels(projects.currentProject.value);
});

export default modelViewerResolver;
