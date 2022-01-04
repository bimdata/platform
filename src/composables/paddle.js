/* eslint no-undef: "off" */

import {
  DATAPACK_PLAN_ID,
  IS_PADDLE_SANDBOX,
  IS_SUBSCRIPTION_ENABLED,
  PADDLE_VENDOR_ID,
  PRO_PLAN_ID
} from "@/config/subscription.js";
import { getPrice } from "@/utils/price.js";

// Setup Paddle configuration (on module load)
if (IS_SUBSCRIPTION_ENABLED) {
  if (IS_PADDLE_SANDBOX) Paddle.Environment.set("sandbox");
  Paddle.Setup({ vendor: +PADDLE_VENDOR_ID });
}

const loadCheckout = (containerID, link, locale, { onLoad, onSuccess }) => {
  Paddle.Checkout.open({
    // Checkout params
    method: "inline",
    referring_domain: "platform",
    override: link,
    locale,

    // Checkout frame
    frameTarget: containerID,
    frameInitialHeight: 416,
    frameStyle:
      "width:100%; min-width:312px; background-color: transparent; border: none;",

    loadCallback: onLoad,
    successCallback: onSuccess
  });
};

const getPrices = productID => {
  return new Promise(resolve => {
    Paddle.Product.Prices(+productID, response => resolve(response));
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
