import { usePayment } from "@/state/payment.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async () => {
  const payment = usePayment();

  await payment.loadSpaceSubscriptions(payment.currentSpace.value);
});
