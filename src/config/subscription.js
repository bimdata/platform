const SUBSCRIPTION_ENABLED = process.env.VUE_APP_SUBSCRIPTION_ENABLED;
const FREE_PLAN_STORAGE = process.env.VUE_APP_FREE_PLAN_STORAGE;
const PRO_PLAN_ID = process.env.VUE_APP_PRO_PLAN_ID;
const PRO_PLAN_STORAGE = process.env.VUE_APP_PRO_PLAN_STORAGE;
const DATAPACK_PLAN_ID = process.env.VUE_APP_DATAPACK_PLAN_ID;

console.log("Debug: from config: ", { SUBSCRIPTION_ENABLED });

const IS_SUBSCRIPTION_ENABLED = SUBSCRIPTION_ENABLED === "true";

console.log("Debug: from config: ", { IS_SUBSCRIPTION_ENABLED });

export {
  IS_SUBSCRIPTION_ENABLED,
  FREE_PLAN_STORAGE,
  PRO_PLAN_ID,
  PRO_PLAN_STORAGE,
  DATAPACK_PLAN_ID
};
