import { useSubscriptions } from "@/state/subscriptions.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async () => {
  const payment = useSubscriptions();

  await payment.retrieveSpaceSubscriptions(payment.currentSpace.value);
});
