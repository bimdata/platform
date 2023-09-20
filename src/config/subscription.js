/**
 * This is the production deployment date for subscription features.
 * It is defined here in order to display some info to our users
 * based on their spaces creation date.
 */
const SUBSCRIPTION_START_DATE = new Date("2022-01-10T01:00:00");

// Env variables
const SUBSCRIPTION_ENABLED = ENV.VUE_APP_SUBSCRIPTION_ENABLED;
const PADDLE_SANDBOX = ENV.VUE_APP_PADDLE_SANDBOX;
const PADDLE_VENDOR_ID = ENV.VUE_APP_PADDLE_VENDOR_ID;
const PRO_PLAN_ID = ENV.VUE_APP_PRO_PLAN_ID;
const DATAPACK_PLAN_ID = ENV.VUE_APP_DATAPACK_PLAN_ID;
const FREE_PLAN_STORAGE = ENV.VUE_APP_FREE_PLAN_STORAGE;
const PRO_PLAN_STORAGE = ENV.VUE_APP_PRO_PLAN_STORAGE;
const BONUS_STORAGE = 100 * 1024 ** 2; // 100 MB

const IS_SUBSCRIPTION_ENABLED = SUBSCRIPTION_ENABLED === "true";
const IS_PADDLE_SANDBOX = PADDLE_SANDBOX === "true";

const SUB_STATUS = Object.freeze({
  ACTIVE: "active",
  DELETED: "deleted",
  PAST_DUE: "past_due",
  PAUSED: "paused",
  TRIALING: "trialing"
});

export {
  SUBSCRIPTION_START_DATE,
  IS_SUBSCRIPTION_ENABLED,
  IS_PADDLE_SANDBOX,
  PADDLE_VENDOR_ID,
  PRO_PLAN_ID,
  DATAPACK_PLAN_ID,
  FREE_PLAN_STORAGE,
  PRO_PLAN_STORAGE,
  BONUS_STORAGE,
  SUB_STATUS
};
