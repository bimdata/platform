import routeNames from "../../../router/route-names.js";
import { useSpaces } from "../../../state/spaces.js";

const { freeSpaces } = useSpaces();

export default async function subscribeGuard() {
  // Redirect to pro plan subscription if the user already has a free space
  if (freeSpaces.value.length > 0) {
    return { name: routeNames.subscriptionPro };
  }
}
