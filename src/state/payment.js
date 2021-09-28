import { reactive } from "vue";
import PaymentService from "@/services/PaymentService.js";

const state = reactive({
  platformSubscriptions: []
});

const retrievePlaformSubscriptions = async () => {
  return await PaymentService.retrievePlatformSubscriptions();
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
    retrievePlaformSubscriptionPayments,
    subscribeDataPack,
    updateDataPack,
    createPaddleSubscriptionUrl
  };
}
