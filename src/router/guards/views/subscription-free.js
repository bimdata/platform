import { useSubscriptions } from "@/state/subscriptions.js";

const { setCurrentOrga } = useSubscriptions();

export default async function subscriptionFreeGuard(route) {
  setCurrentOrga(null);

  if (route.query.organization) {
    setCurrentOrga(+route.query.organization);
  }
}
