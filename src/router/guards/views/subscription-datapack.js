import routeNames from "@/router/route-names.js";
import { useSubscriptions } from "@/state/subscriptions.js";

const { setCurrentSpace } = useSubscriptions();

export default async function subscriptionDatapackGuard(route) {
  setCurrentSpace(null);

  if (route.query.space) {
    setCurrentSpace(+route.query.space);
    return true;
  }

  // Redirect to pro plan subscription if no space is selected
  return { name: routeNames.subscriptionPro };
}
