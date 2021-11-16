import { useSubscriptions } from "@/state/subscriptions.js";

const { setCurrentOrga, setCurrentSpace } = useSubscriptions();

export default async function subscriptionProGuard(route) {
  setCurrentOrga(null);
  setCurrentSpace(null);

  if (route.query.space) {
    setCurrentSpace(+route.query.space);
    return true;
  }

  if (route.query.organization) {
    setCurrentOrga(+route.query.organization);
  }
}
