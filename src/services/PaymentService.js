import apiClient from "../services/api-client.js";

class PaymentService {
  async retrievePlatformSubscriptions() {
    const organization = 
    const response = await fetch(
      `${process.env.VUE_APP_API_BASE_URL}/private
    ​/payment​/organization​/${organization.id}​/cloud​/${cloud.id}​/subscription`,
      {
        headers: {
          Authorization: apiClient.config.accessToken(),
        },
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw response;
    }
  }
}

const service = new PaymentService();

export default service;
