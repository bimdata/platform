import { reactive } from "vue";
import PaymentService from "@/services/PaymentService.js";

const state = reactive({
  plaformSubscriptionPayments: [],
  platformSubscriptions: [],
  organizationPlatformSubscriptions: []
});

const retrievePlaformSubscriptions = async (orga, space) => {
  const subscription = await PaymentService.retrievePlaformSubscriptions(
    orga,
    space
  );
  state.platformSubscriptions = subscription.platformSubscriptions;
  return subscription;
};

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

const retrieveSpaceInformation = space => {
  return PaymentService.retrieveSpaceInformation(space);
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
    retrievePlaformSubscriptions,
    retrieveOrganizationPlaformSubscriptions,
    retrievePlaformSubscriptionPayments,
    retrieveSpaceInformation,
    subscribeDataPack,
    updateDataPack,
    createPaddleSubscriptionUrl
  };
}
