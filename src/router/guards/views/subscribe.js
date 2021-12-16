import routeNames from "@/router/route-names.js";
import SubscriptionService from "@/services/SubscriptionService.js";

export default async function subscribeGuard() {
  // Redirect to pro plan subscription
  // if the user already has a free space
  const freeSpaces = await SubscriptionService.fetchFreeSpaces();
  if (freeSpaces.length > 0) {
    return { name: routeNames.subscriptionPro };
  }
}
