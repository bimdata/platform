import routeNames from "../../../router/route-names.js";
import SpaceService from "../../../services/SpaceService.js";

export default async function spaceBoardGuard(route) {
  const space = await SpaceService.fetchSpaceByID(route.params.spaceID);
  if (!space) {
    return { name: routeNames.pageNotFound };
  }
}
