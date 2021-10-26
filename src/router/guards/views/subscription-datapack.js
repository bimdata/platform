import { routeNames } from "@/router/index.js";
import { usePayment } from "@/state/payment.js";

export default async function subscriptionDatapackGuard(route) {
  const { currentSpace, setCurrentSpace } = usePayment();

  if (!currentSpace.value) {
    if (route.query.space) {
      setCurrentSpace(+route.query.space);
      return { name: routeNames.subscriptionDatapack };
    } else {
      return { name: routeNames.subscriptionPlatform };
    }
  }
}
