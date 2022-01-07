import { useSession } from "@/composables/session.js";
import routeNames from "@/router/route-names.js";
import { useSpaces } from "@/state/spaces.js";

const { previousView } = useSession();
const { freeSpaces } = useSpaces();

export default async function subscribeGuard() {
  // If this is the landing view (i.e. there is no previous route)
  // then continue navigation and skip free space check.
  // if (!previousView.get()?.name) {
  //   return true;
  // }

  // Redirect to pro plan subscription
  // if the user already has a free space
  if (freeSpaces.value.length > 0) {
    return { name: routeNames.subscriptionPro };
  }
}
