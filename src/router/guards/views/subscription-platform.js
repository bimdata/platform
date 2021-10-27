import { routeNames } from "@/router/index.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default async function subscriptionPlatformGuard(route) {
  if (route.query.organization) {
    const { setCurrentOrga } = useSubscriptions();
    setCurrentOrga(+route.query.organization);
    return { name: routeNames.subscriptionPlatform };
  }
}
