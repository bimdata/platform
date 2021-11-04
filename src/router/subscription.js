/**
 * This module defines routes that are related to the subscription feature.
 */

import routeNames from "./route-names.js";

// Guards
import subscribeGuard from "./guards/views/subscribe.js";
import subscriptionDatapackGuard from "./guards/views/subscription-datapack.js";
import subscriptionFreeGuard from "./guards/views/subscription-free.js";
import subscriptionProGuard from "./guards/views/subscription-pro.js";

// Lazy loaded view components
/* eslint-disable */
const Subscribe = () =>
  import(/* webpackChunkName: "subscribe" */ "@/views/subscribe/Subscribe.vue");
const SubscriptionDatapack = () =>
  import(/* webpackChunkName: "subscription-datapack" */ "@/views/subscription-datapack/SubscriptionDatapack.vue");
const SubscriptionFree = () =>
  import(/* webpackChunkName: "subscription-free" */ "@/views/subscription-free/SubscriptionFree.vue");
const SubscriptionPro = () =>
  import(/* webpackChunkName: "subscription-pro" */ "@/views/subscription-pro/SubscriptionPro.vue");
const UserSubscriptions = () =>
  import(/* webpackChunkName: "user-subscriptions" */ "@/views/user-subscriptions/UserSubscriptions.vue");
/* eslint-enable */

const routes = [
  {
    path: "/subscriptions",
    name: routeNames.userSubscriptions,
    component: UserSubscriptions
  },
  {
    path: "/subscribe",
    name: routeNames.subscribe,
    component: Subscribe,
    meta: {
      guard: subscribeGuard
    }
  },
  {
    path: "/subscription/free",
    name: routeNames.subscriptionFree,
    component: SubscriptionFree,
    meta: {
      guard: subscriptionFreeGuard
    }
  },
  {
    path: "/subscription/pro",
    name: routeNames.subscriptionPro,
    component: SubscriptionPro,
    meta: {
      guard: subscriptionProGuard
    }
  },
  {
    path: "/subscription/datapack",
    name: routeNames.subscriptionDatapack,
    component: SubscriptionDatapack,
    meta: {
      guard: subscriptionDatapackGuard
    }
  }
];

export default routes;
