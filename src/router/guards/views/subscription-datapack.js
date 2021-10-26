import { routeNames } from "@/router/index.js";
import { usePayment } from "@/state/payment.js";

export default async function subscriptionDatapackGuard(route) {
  if (route.query.space) {
    const { setCurrentSpace } = usePayment();
    setCurrentSpace(route.query.organization);
    return { name: routeNames.subscriptionDatapack };
  }
}
