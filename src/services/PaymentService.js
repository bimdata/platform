import { privateApiClient } from "./api-client.js";

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

  retrieveOrganizationPlatformSubscriptions(organization) {
    return privateApiClient.get(
      `/payment/organization/${organization.id}/platform-subscription`
    );
  }
}

const service = new PaymentService();

export default service;
