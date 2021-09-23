import apiClient from "../services/api-client.js";

class OrganizationService {
  async retrieveOrganizations() {
    // return apiClient.getOrganizations();
    const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/private/organization`, {
      headers: {
        Authorization: apiClient.config.accessToken(),
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw response;
    }
  }
}

const service = new OrganizationService();

export default service;
