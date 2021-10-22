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

const generatePlatformSubscriptionLink = space => {
  return PaymentService.generatePlatformSubscriptionLink(space);
};

const createDataPackSubscription = async () => {
  // TODO
};

const updateDataPackSubscription = async () => {
  // TODO
};

export function usePayment() {
  return {
    // Methods
    retrievePlaformSubscriptions,
    retrieveOrganizationPlaformSubscriptions,
    retrievePlaformSubscriptionPayments,
    retrieveSpaceInformation,
    generatePlatformSubscriptionLink,
    createDataPackSubscription,
    updateDataPackSubscription
  };
}
