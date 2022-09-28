/**
 * This module defines routes that are related to the subscription feature.
 */

import routeNames from "./route-names.js";

// Guards
import subscribeGuard from "./guards/views/subscribe.js";
import subscriptionDatapackGuard from "./guards/views/subscription-datapack.js";
import subscriptionFreeGuard from "./guards/views/subscription-free.js";
import subscriptionProGuard from "./guards/views/subscription-pro.js";
import userSubscriptionsGuard from "./guards/views/user-subscriptions.js";

// Lazy loaded view components
/* eslint-disable */
const Subscribe = () => import("../views/subscribe/Subscribe.vue");
const SubscriptionDatapack = () => import("../views/subscription-datapack/SubscriptionDatapack.vue");
const SubscriptionFree = () => import("../views/subscription-free/SubscriptionFree.vue");
const SubscriptionPro = () => import("../views/subscription-pro/SubscriptionPro.vue");
const UserSubscriptions = () => import("../views/user-subscriptions/UserSubscriptions.vue");
/* eslint-enable */

const {
  dashboard,
  userSubscriptions,
  subscribe,
  subscriptionFree,
  subscriptionPro,
  subscriptionDatapack
} = routeNames;

const routes = [
  {
    path: "/subscriptions",
    name: userSubscriptions,
    component: UserSubscriptions,
    meta: {
      back: dashboard,
      guard: userSubscriptionsGuard
    }
  },
  {
    path: "/subscribe",
    name: subscribe,
    component: Subscribe,
    meta: {
      backDefault: dashboard,
      guard: subscribeGuard
    }
  },
  {
    path: "/subscription/free",
    name: subscriptionFree,
    component: SubscriptionFree,
    meta: {
      backDefault: dashboard,
      guard: subscriptionFreeGuard
    }
  },
  {
    path: "/subscription/pro",
    name: subscriptionPro,
    component: SubscriptionPro,
    meta: {
      backDefault: dashboard,
      guard: subscriptionProGuard
    }
  },
  {
    path: "/subscription/datapack",
    name: subscriptionDatapack,
    component: SubscriptionDatapack,
    meta: {
      backDefault: dashboard,
      guard: subscriptionDatapackGuard
    }
  }
];

export default routes;
