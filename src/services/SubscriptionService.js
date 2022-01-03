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

  async fetchSpaceInformation(space) {
    const size = await apiClient.collaborationApi.getCloudSize({
      id: space.id
    });

    // Derive used size from remaining size
    const usedSizePercent = 100 - size.remainingSmartDataSizePercent;

    const isPlatformSubscription = size.managedBy === "BIMDATA_PLATFORM";
    let isOrganizationMember = false;
    let isPlatformPaid = false;
    let activeSubscriptions = [];

    if (isPlatformSubscription) {
      try {
        const subscriptions = await privateApiClient.get(
          `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription`
        );
        isOrganizationMember = true;
        // boolean for upgrade platform or pay platform pro
        activeSubscriptions = subscriptions.filter(
          sub => sub.status === "active"
        );
        isPlatformPaid = activeSubscriptions.length > 0;
      } catch {
        isOrganizationMember = false;
      }
    }

    return {
      usedSizePercent,
      isPlatformSubscription,
      isOrganizationMember,
      isPlatformPaid,
      activeSubscriptions,
      ...size
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
