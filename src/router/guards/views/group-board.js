import routeNames from "../../../router/route-names.js";
import GroupService from "../../../services/GroupService.js";

export default async function groupBoardGuard(route) {
  const group = await GroupService.fetchGroupByID(
    {
      cloud: { id: route.params.spaceID },
      id: route.params.projectID
    },
    route.params.groupID
  );
  if (!group) {
    return { name: routeNames.pageNotFound };
  }
}
