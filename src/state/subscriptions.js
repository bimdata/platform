import { reactive, readonly, toRefs } from "vue";
import OrganizationService from "@/services/OrganizationService.js";
import SpaceService from "@/services/SpaceService.js";
import SubscriptionService from "@/services/SubscriptionService.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";
import { useUser } from "@/state/user.js";
import { delay } from "@/utils/async.js";

const state = reactive({
  currentOrga: null,
  currentSpace: null,
  organizationsSubscriptions: {},
  spacesSubscriptions: {}
});

const setCurrentOrga = id => {
  const { userOrganizations } = useOrganizations();
  const orga = userOrganizations.value.find(orga => orga.id === id) || null;
  state.currentOrga = orga;
  return orga;
};

const setCurrentSpace = id => {
  const { userSpaces } = useSpaces();
  const space = userSpaces.value.find(space => space.id === id) || null;
  state.currentOrga = space ? space.organization : null;
  state.currentSpace = space;
  return space;
};

const loadOrganizationSubscriptions = async orga => {
  const subscriptions =
    await SubscriptionService.fetchOrganizationSubscriptions(orga);
  state.organizationsSubscriptions[orga.id] = subscriptions;
  return subscriptions;
};

const loadSpaceSubscriptions = async space => {
  const subscriptions = await SubscriptionService.fetchSpaceSubscriptions(
    space
  );
  state.spacesSubscriptions[space.id] = subscriptions;
  return subscriptions;
};

const loadAllSpacesSubscriptions = async () => {
  const { userOrganizations, getOrganizationSpaces } = useOrganizations();
  const spaces = userOrganizations.value.flatMap(orga =>
    getOrganizationSpaces(orga)
  );
  return (
    await Promise.all(spaces.map(space => loadSpaceSubscriptions(space)))
  ).reduce((acc, subscriptions) => acc.concat(subscriptions), []);
};

const loadSubscriptionPayments = (orga, space, subscription) => {
  return SubscriptionService.fetchSubscriptionPayments(
    orga,
    space,
    subscription
  );
};

const fetchSpaceSubInfo = space => {
  return SubscriptionService.fetchSpaceSubInfo(space);
};

const getSpaceSubscriptions = space => {
  return readonly(state.spacesSubscriptions[space?.id] || []);
};

const getSpaceActiveSubscription = space => {
  return getSpaceSubscriptions(space).find(sub => sub.status === "active");
};

const getSpaceActiveDatapack = space => {
  const subscription = getSpaceActiveSubscription(space);
  return subscription?.data_packs.find(d => d.status === "active");
};

const getPlatformSubscriptionLink = space => {
  if (space.id) {
    // Call "generate subscription link" route to upgrade an existing space
    return SubscriptionService.generatePlatformSubscriptionLink(space);
  } else {
    // Call "create subscription" route to create a new space
    return SubscriptionService.createPlatformSubscription(space);
  }
};

/**
 * This method takes a space as a parameter and checks the list of spaces
 * of its organization every 2 seconds until one of them is found to have
 * the same name. As space names are unique in a given organization this
 * will mean that the space (given as a parameter) has been created.
 * Then it returns the newly created space.
 *
 * @param {Object} space
 * @returns {Object}
 */
const waitForCreatedSpace = async space => {
  let spaces = [],
    newSpace = null;
  while (!newSpace) {
    // Fetch organization spaces from API
    spaces = await OrganizationService.fetchOrganizationSpaces(
      space.organization
    );
    newSpace = spaces.find(s => s.name === space.name);
    if (newSpace) break; // Exit loop if space is created
    await delay(2000); // else wait 2s before next check
  }

  // Reload the list of spaces
  const { loadUser } = useUser();
  await loadUser();
  const { loadUserSpaces } = useSpaces();
  await loadUserSpaces();
  const { loadOrganizationSpaces } = useOrganizations();
  await loadOrganizationSpaces(newSpace.organization);

  return newSpace;
};

/**
 * This method takes a space and an initial size as parameters and check
 * every 500ms for the space size until it find it to be different from
 * the initial size, which means space size has been updated on the backend side.
 * Then it returns the new space size.
 *
 * @param {Object} space
 * @param {Number} size
 * @param {Number} expectedSize
 * @returns {Number}
 */
const waitForUpdatedSpaceSize = async (space, size, expectedSize) => {
  let newSize = size;
  while (newSize === size && newSize !== expectedSize) {
    // Fetch space size from API
    newSize = (await SpaceService.fetchSpaceSize(space)).smartDataSizeAvailable;

    if (newSize !== size || newSize === expectedSize) break; // Exit loop if space size is updated
    await delay(500); // else wait 500 ms before next check
  }

  return newSize;
};

const createDatapack = (space, quantity) => {
  return SubscriptionService.createDatapackSubscription(space, quantity);
};

const updateDatapack = (space, datapack, quantity) => {
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
    loadOrganizationSubscriptions,
    loadSpaceSubscriptions,
    loadAllSpacesSubscriptions,
    loadSubscriptionPayments,
    fetchSpaceSubInfo,
    getSpaceSubscriptions,
    getSpaceActiveSubscription,
    getSpaceActiveDatapack,
    getPlatformSubscriptionLink,
    waitForCreatedSpace,
    waitForUpdatedSpaceSize,
    createDatapack,
    updateDatapack
  };
}
