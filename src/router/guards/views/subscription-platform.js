import { routeNames } from "@/router/index.js";
import { usePayment } from "@/state/payment.js";

export default async function subscriptionPlatformGuard(route) {
  if (route.query.organization) {
    const { setCurrentOrga } = usePayment();
    setCurrentOrga(route.query.organization);
    return { name: routeNames.subscriptionPlatform };
  }
}
