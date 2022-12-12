import { SPACE_ROLE } from "../config/spaces.js";
import { useUser } from "../state/user.js";

const { spaceRoles } = useUser();

function isFull(spaceSubInfo) {
  return (
    spaceSubInfo.remaining_smart_data_size != null &&
    spaceSubInfo.remaining_smart_data_size <= 0
  );
}

function isFullTotal(spaceSubInfo) {
  return (
    spaceSubInfo.remaining_total_size != null &&
    spaceSubInfo.remaining_total_size <= 0
  );
}

function isSpaceAdmin(space) {
  return spaceRoles.value[space.id] === SPACE_ROLE.ADMIN;
}

export { isFull, isFullTotal, isSpaceAdmin };
