import { reactive } from "vue";
import PaymentService from "@/services/PaymentService.js";

const state = reactive({
  organizationPlatformSubscriptions: [],
  spacePlatformSubscriptions: []
});

const retrieveOrganizationPlaformSubscriptions = async orga => {
  const organization =
    await PaymentService.retrieveOrganizationPlatformSubscriptions(orga);
  state.organizationPlatformSubscriptions =
    organization.organizationPlatformSubscriptions;
  return organization;
};

const retrieveSpacePlatformSubscriptions = async (orga, space) => {
  const subscription = await PaymentService.retrieveSpacePlatformSubscriptions(
    orga,
    space
  );
  state.spacePlatformSubscriptions = subscription.platformSubscriptions;
  return subscription;
};

const retrievePlatformSubscriptionPayments = async (
  orga,
  space,
  subscription
) => {
  const payments = await PaymentService.retrievePlatformSubscriptionPayments(
    orga,
    space,
    subscription
  );
  return payments;
};

const retrieveSpaceInformation = space => {
  return PaymentService.retrieveSpaceInformation(space);
};

const generatePlatformSubscriptionLink = space => {
  return PaymentService.generatePlatformSubscriptionLink(space);
};

const createDatapackSubscription = async () => {
  // TODO
};

const updateDatapackSubscription = async () => {
  // TODO
};

export function usePayment() {
  return {
    // Methods
    retrieveSpacePlatformSubscriptions,
    retrieveOrganizationPlaformSubscriptions,
    retrievePlatformSubscriptionPayments,
    retrieveSpaceInformation,
    generatePlatformSubscriptionLink,
    createDatapackSubscription,
    updateDatapackSubscription
  };
}
