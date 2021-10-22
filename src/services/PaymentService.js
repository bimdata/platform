import { apiClient, privateApiClient } from "./api-client.js";

class PaymentService {
  async retrievePlaformSubscriptions(organization, space) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/cloud/${space.id}/subscription`
      );
    } catch (e) {
      console.log(e);
    }
  }

  async retrievePlaformSubscriptionPayments(organization, space, subscription) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/cloud/${space.id}/subscription/${subscription.subscription_id}/payment`
      );
    } catch (e) {
      console.log(e);
    }
  }

  async retrieveOrganizationPlatformSubscriptions(organization) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/platform-subscription`
      );
    } catch (error) {
      console.log(error);
    }
  }

  async retrieveSpaceInformation(space) {
    const size = await apiClient.collaborationApi.getCloudSize({
      id: space.id
    });
    const isPlatformSubscription = size.managedBy === "BIMDATA_PLATFORM";
    let isOrganizationMember = false;
    let isPlatformPaid = false;

    if (isPlatformSubscription) {
      try {
        let platformSubscriptions = await this.retrievePlaformSubscriptions(
          space.organization,
          space
        );
        isOrganizationMember = true;
        // boolean for upgrade platform or pay platform pro
        isPlatformPaid = platformSubscriptions.some(
          platformSubscription => platformSubscription.status === "active"
        );
      } catch (e) {
        isOrganizationMember = false;
      }
    }

    // calculation of the remaining size
    const usedSizePercent = 100 - size.remainingSmartDataSizePercent;

    return {
      usedSizePercent,
      isPlatformPaid,
      isOrganizationMember,
      isPlatformSubscription,
      ...size
    };
  }

  async generatePlatformSubscriptionLink(space) {
    try {
      return await privateApiClient.post(
        `/payment/organization/${space.organization.id}/cloud/${space.id}/subscription/generate-platform-subscription`
      );
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new PaymentService();

export default service;
