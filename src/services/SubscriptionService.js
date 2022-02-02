import { apiClient, privateApiClient } from "./api-client.js";
import { ERRORS, ErrorService, RuntimeError } from "./ErrorService.js";

class SubscriptionService {
  async fetchOrganizationSubscriptions(organization) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/platform-subscription`
      );
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.SUBSCRIPTIONS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchSpaceSubscriptions(space) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription`
      );
    } catch (error) {
      ErrorService.handleError(error);
      return [];
    }
  }

  async fetchSubscriptionPayments(organization, space, subscription) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/cloud/${space.id}/subscription/${subscription.subscription_id}/payment`
      );
    } catch (error) {
      ErrorService.handleError(error);
      return [];
    }
  }

  async fetchFreeSpaces() {
    try {
      return await privateApiClient.get(`/payment/free-cloud`);
    } catch (error) {
      ErrorService.handleError(error);
      return [];
    }
  }

  async fetchSpaceSubInfo(space) {
    const subInfo = await apiClient.collaborationApi.getCloudSize({
      id: space.id
    });

    // Derive used size from remaining size
    const usedSizePercent = 100 - subInfo.remainingSmartDataSizePercent;
    // Check whether space is managed by a platform subscription
    const isPlatformSubscription = subInfo.managedBy === "BIMDATA_PLATFORM";
    const isCustomSubscription =  subInfo.is_custom;

    let isOrganizationMember = false;
    let isPlatformPro = false;
    let subscriptions = [];
    let activeSubscriptions = [];

    if (isPlatformSubscription) {
      try {
        subscriptions = await privateApiClient.get(
          `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription`
        );
        isOrganizationMember = true;
      } catch {
        isOrganizationMember = false;
      }

      if (isOrganizationMember) {
        activeSubscriptions = subscriptions.filter(
          sub => sub.status === "active"
        );
        isPlatformPro = activeSubscriptions.length > 0;
      }
    }

    return {
      isPlatformSubscription,
      isOrganizationMember,
      isPlatformPro,
      activeSubscriptions,
      usedSizePercent,
      ...subInfo
    };
  }

  async generatePlatformSubscriptionLink(space) {
    try {
      return await privateApiClient.post(
        `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription/generate-platform-subscription`
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.PLATFORM_SUBSCRIBE_ERROR, error);
    }
  }

  async createPlatformSubscription(space) {
    try {
      return await privateApiClient.post(
        `/payment/organization/${space.organization.id}/platform-subscription/create`,
        { cloud_name: space.name }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.PLATFORM_SUBSCRIBE_ERROR, error);
    }
  }

  async createDatapackSubscription(space, quantity) {
    try {
      return await privateApiClient.post(
        `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription/create-platform-data-pack-subscription`,
        { quantity }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.DATAPACK_SUBSCRIBE_ERROR, error);
    }
  }

  async updateDatapackSubscription(space, datapack, quantity) {
    try {
      return await privateApiClient.patch(
        `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription/update-platform-data-pack-subscription`,
        {
          subscription_id: datapack.subscription_id,
          quantity
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.DATAPACK_UPDATE_ERROR, error);
    }
  }
}

const service = new SubscriptionService();

export default service;
