import { reactive, readonly, toRefs } from "vue";
import PaymentService from "@/services/PaymentService.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

const state = reactive({
  currentOrga: null,
  currentSpace: null,
  spaceSubscriptions: []
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

const loadSpaceSubscriptions = async space => {
  const subscriptions = await PaymentService.fetchSpaceSubscriptions(space);
  state.spaceSubscriptions = subscriptions;
  return subscriptions;
};

const retrieveOrganizationPlaformSubscriptions = orga => {
  return PaymentService.retrieveOrganizationPlatformSubscriptions(orga);
};

const retrievePlatformSubscriptionPayments = (orga, space, subscription) => {
  return PaymentService.retrievePlatformSubscriptionPayments(
    orga,
    space,
    subscription
  );
};

const retrieveSpaceInformation = space => {
  return PaymentService.retrieveSpaceInformation(space);
};

const generatePlatformSubscriptionLink = space => {
  return PaymentService.generatePlatformSubscriptionLink(space);
};

const createDatapackSubscription = (space, quantity) => {
  return PaymentService.createDatapackSubscription(space, quantity);
};

export function usePayment() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    setCurrentOrga,
    setCurrentSpace,
    loadSpaceSubscriptions,

    retrieveOrganizationPlaformSubscriptions,
    retrievePlatformSubscriptionPayments,
    retrieveSpaceInformation,
    generatePlatformSubscriptionLink,
    createDatapackSubscription
  };
}
