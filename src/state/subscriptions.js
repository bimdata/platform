import { reactive, readonly, toRefs } from "vue";
import SubscriptionService from "@/services/SubscriptionService.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

const state = reactive({
  isSubscriptionEnabled: process.env.VUE_APP_SUBSCRIPTION_ENABLED === "true",
  currentOrga: null,
  currentSpace: null,
  organizationsSubscriptions: {},
  spacesSubscriptions: {}
});

const setCurrentOrga = id => {
  const { userOrganizations } = useOrganizations();
  const orga = userOrganizations.value.find(orga => orga.id === id);
  state.currentOrga = orga;
  return orga;
};

const setCurrentSpace = id => {
  const { userSpaces } = useSpaces();
  const space = userSpaces.value.find(space => space.id === id);
  state.currentOrga = space.organization;
  state.currentSpace = space;
  return space;
};

const retrieveOrganizationSubscriptions = async orga => {
  const subscriptions =
    await SubscriptionService.fetchOrganizationSubscriptions(orga);
  state.organizationsSubscriptions[orga.id] = subscriptions;
  return subscriptions;
};

const retrieveSpaceSubscriptions = async space => {
  const subscriptions = await SubscriptionService.fetchSpaceSubscriptions(
    space
  );
  state.spacesSubscriptions[space.id] = subscriptions;
  return subscriptions;
};

const retrieveAllSpacesSubscriptions = async () => {
  const { userOrganizations, getOrganizationSpaces } = useOrganizations();
  const spaces = userOrganizations.value.flatMap(orga =>
    getOrganizationSpaces(orga)
  );
  return (
    await Promise.all(spaces.map(space => retrieveSpaceSubscriptions(space)))
  ).reduce((acc, subscriptions) => acc.concat(subscriptions), []);
};

const getSpaceSubscriptions = space => {
  return readonly(state.spacesSubscriptions[space?.id] || []);
};

const getSpaceActiveSubscription = space => {
  return getSpaceSubscriptions(space).find(sub => sub.status === "active");
};

const retrieveSubscriptionPayments = (orga, space, subscription) => {
  return SubscriptionService.fetchSubscriptionPayments(
    orga,
    space,
    subscription
  );
};

const retrieveSpaceInformation = space => {
  return SubscriptionService.fetchSpaceInformation(space);
};

const generatePlatformSubscriptionLink = space => {
  return SubscriptionService.generatePlatformSubscriptionLink(space);
};

const createDatapackSubscription = (space, quantity) => {
  return SubscriptionService.createDatapackSubscription(space, quantity);
};

const updateDatapackSubscription = (space, datapack, quantity) => {
  return SubscriptionService.updateDatapackSubscription(
    space,
    datapack,
    quantity
  );
};

export function useSubscriptions() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    setCurrentOrga,
    setCurrentSpace,
    retrieveOrganizationSubscriptions,
    retrieveSpaceSubscriptions,
    retrieveAllSpacesSubscriptions,
    getSpaceSubscriptions,
    getSpaceActiveSubscription,
    retrieveSubscriptionPayments,
    retrieveSpaceInformation,
    generatePlatformSubscriptionLink,
    createDatapackSubscription,
    updateDatapackSubscription
  };
}
