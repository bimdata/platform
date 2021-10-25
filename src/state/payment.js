import PaymentService from "@/services/PaymentService.js";

const retrieveOrganizationPlaformSubscriptions = orga => {
  return PaymentService.retrieveOrganizationPlatformSubscriptions(orga);
};

const retrievePlatformSubscriptionPayments = (orga, space, subscription) => {
  return PaymentService.retrievePlatformSubscriptionPayments(
    orga,
    space,
    subscription
  );
};

const retrieveSpaceInformation = space => {
  return PaymentService.retrieveSpaceInformation(space);
};

const generatePlatformSubscriptionLink = space => {
  return PaymentService.generatePlatformSubscriptionLink(space);
};

const createDatapackSubscription = (space, quantity) => {
  return PaymentService.createDatapackSubscription(space, quantity);
};

export function usePayment() {
  return {
    // Methods
    retrieveOrganizationPlaformSubscriptions,
    retrievePlatformSubscriptionPayments,
    retrieveSpaceInformation,
    generatePlatformSubscriptionLink,
    createDatapackSubscription
  };
}
