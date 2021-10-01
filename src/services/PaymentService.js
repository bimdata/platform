import { privateApiClient } from "./api-client.js";

class PaymentService {
  async retrieveOrganizationPlatformSubscriptions(organization) {
    try {
      return await privateApiClient.get(
        `/payment/organization/${organization.id}/platform-subscription`
      );
    } catch (e) {
      console.log(e);
    }
  }
}

const service = new PaymentService();

export default service;
