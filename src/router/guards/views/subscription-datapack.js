import { routeNames } from "@/router/index.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default async function subscriptionDatapackGuard(route) {
  const { currentSpace, setCurrentSpace } = useSubscriptions();

  if (!currentSpace.value) {
    if (route.query.space) {
      setCurrentSpace(+route.query.space);
      return { name: routeNames.subscriptionDatapack };
    } else {
      return { name: routeNames.subscriptionPlatform };
    }
  }
}
