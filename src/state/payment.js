import { reactive } from "vue";
import PaymentService from "@/services/PaymentService.js";

const state = reactive({
  platformSubscriptions: [],
  organizationPlatformSubscriptions: []
});

const retrievePlaformSubscriptions = async () => {
  return await PaymentService.retrievePlatformSubscriptions();
};

const retrieveOrganizationPlaformSubscriptions = async org => {
  const organization =
    await PaymentService.retrieveOrganizationPlatformSubscriptions(org);
  state.organizationPlatformSubscriptions =
    organization.organizationPlatformSubscriptions;
  return organization;
};

const retrievePlaformSubscriptionPayments = async () => {
  // TODO
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
    subscribeDataPack,
    updateDataPack,
    createPaddleSubscriptionUrl
  };
}
