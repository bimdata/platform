/* eslint-disable */
import { load } from "@/components/specific/app/app-loading/app-loading.js";
import { useGroups } from "@/state/groups.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useFiles } from "@/state/files.js";

const spaces = useSpaces();
const projects = useProjects();
const models = useModels();
const files = useFiles();
const groups = useGroups();

export default function projectBoardResolver(route) {
  const space = spaces.setCurrentSpace(+route.params.spaceID);
  const project = projects.setCurrentProject(+route.params.projectID);

  spaces.loadSpaceSubInfo(space);
  projects.loadSpaceProjects(space);

  load("project-users", [
    projects.loadProjectUsers(project),
    projects.loadProjectInvitations(project)
  ]);
  load("project-models", [
    models.loadProjectModels(project)
  ]);
  load("project-files", [
    files.loadProjectFileStructure(project),
    groups.loadProjectGroups(project)
  ]);
}
