import routeNames from "../../../router/route-names.js";
import ProjectService from "../../../services/ProjectService.js";

export default async function projectBoardGuard(route) {
  const project = await ProjectService.fetchProjectByID(
    { id: route.params.spaceID },
    route.params.projectID
  );
  if (!project) {
    return { name: routeNames.pageNotFound };
  }
}
