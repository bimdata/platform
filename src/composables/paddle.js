import { DATAPACK_PLAN_ID, PRO_PLAN_ID } from "@/config/subscription.js";
import { getPrice } from "@/utils/price.js";

const loadCheckout = (containerID, link, { onLoad, onSuccess }) => {
  Paddle.Checkout.open({
    // Checkout params
    method: "inline",
    referring_domain: "platform",
    override: link,

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
