import { routeNames } from "@/router";
import SpaceService from "@/services/SpaceService.js";

const spaceBoardGuard = async route => {
  const space = await SpaceService.fetchSpaceByID(route.params.spaceID);
  if (!space) {
    return { name: routeNames.pageNotFound };
  }
};

export default spaceBoardGuard;
