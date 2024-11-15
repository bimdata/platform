import { initializePaddle } from "@paddle/paddle-js";
import {
  DATAPACK_PLAN_ID,
  IS_PADDLE_SANDBOX,
  IS_SUBSCRIPTION_ENABLED,
  PADDLE_VENDOR_ID,
  PRO_PLAN_ID,
} from "../config/subscription.js";
import { getPrice } from "../utils/price.js";

let paddlePromise;
// Setup Paddle configuration (on module load)
if (IS_SUBSCRIPTION_ENABLED) {
  paddlePromise = new Promise(resolve => {
    initializePaddle({
      version: "classic",
      vendor: +PADDLE_VENDOR_ID,
      environment: IS_PADDLE_SANDBOX ? "sandbox": undefined,
    }).then(instance => resolve(instance))

  });
}

const loadCheckout = async (containerID, link, locale, { onLoad, onSuccess }) => {
  const paddleInstance = await paddlePromise;
  paddleInstance.Checkout.open({
    // Checkout params
    method: "inline",
    referring_domain: "platform",
    override: link,
    locale,

    // Checkout frame
    frameTarget: containerID,
    frameInitialHeight: 416,
    frameStyle:
      "width:100%; min-width:312px; height: 660px; background-color: transparent; border: none;",

    loadCallback: onLoad,
    successCallback: onSuccess
  });
};

const getPrices = async productID => {
  const paddleInstance = await paddlePromise;
  return new Promise(resolve => {
    paddleInstance.Product.Prices(+productID, response => resolve(response));
  });
};

const getProPlanPrice = async () => {
  const response = await getPrices(PRO_PLAN_ID);
  return getPrice(response);
};

const getDatapackPrice = async () => {
  const response = await getPrices(DATAPACK_PLAN_ID);
  return getPrice(response);
};

export function usePaddle() {
  return {
    loadCheckout,
    getProPlanPrice,
    getDatapackPrice
  };
}
