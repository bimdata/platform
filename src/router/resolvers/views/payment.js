import { usePayment } from "@/state/payment.js";
import { useSpaces } from "@/state/spaces.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async () => {
  const { currentSpace } = useSpaces();
  const { retrievePlaformSubscriptions } = usePayment();

  if (currentSpace.value) {
    await retrievePlaformSubscriptions(
      currentSpace.value.organization,
      currentSpace.value
    );
  }
});
