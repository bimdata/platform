import routeNames from "../../../router/route-names.js";
import SubscriptionService from "../../../services/SubscriptionService.js";
import { useSubscriptions } from "../../../state/subscriptions.js";

const { setCurrentOrga } = useSubscriptions();

export default async function subscriptionFreeGuard(route) {
  // Redirect to "subscribe" view if the user already has a free space
  const freeSpaces = await SubscriptionService.fetchFreeSpaces();
  if (freeSpaces.length > 0) {
    return { name: routeNames.subscribe };
  }

  setCurrentOrga(null);

  if (route.query.organization) {
    setCurrentOrga(+route.query.organization);
  }
}
