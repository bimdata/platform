import { reactive } from "vue";
import PaymentService from "@/services/PaymentService.js";

const state = reactive({
  plaformSubscriptionPayments: [],
  platformSubscriptions: [],
  organizationPlatformSubscriptions: []
});

const retrieveOrganizationPlaformSubscriptions = async orga => {
  const organization =
    await PaymentService.retrieveOrganizationPlatformSubscriptions(orga);
  state.organizationPlatformSubscriptions =
    organization.organizationPlatformSubscriptions;
  return organization;
};

const retrievePlaformSubscriptionPayments = async (
  orga,
  space,
  subscription
) => {
  const payments = await PaymentService.retrievePlaformSubscriptionPayments(
    orga,
    space,
    subscription
  );
  state.plaformSubscriptionPayments = payments.plaformSubscriptionPayments;
  return payments;
};

const subscribeDataPack = async () => {
  // TODO
};

const updateDataPack = async () => {
  // TODO
};

const createPaddleSubscriptionUrl = async () => {
  // TODO
};

export function usePayment() {
  return {
    // Methods
    // retrievePlaformSubscriptions,
    retrieveOrganizationPlaformSubscriptions,
    retrievePlaformSubscriptionPayments,
    subscribeDataPack,
    updateDataPack,
    createPaddleSubscriptionUrl
  };
}
