import apiClient from "./api-client.js";

class PlatformService {
  loginCallback(accessToken) {
    return fetch(
      `${ENV.VUE_APP_BACKEND_BASE_URL}/create_or_update_user/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  }

  async loadGuidedTours() {
    const res = await fetch(
      `${ENV.VUE_APP_BACKEND_BASE_URL}/guidedtour/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...apiClient.authHeader
        }
      }
    );
    if (res.status !== 200) {
      console.warn(`Unable to load guidedtour info. Error code: ${res.status}`)
      return [];
    }
    return res.json();
  }

  async setTourCompleted(tour) {
    const res = await fetch(
      `${ENV.VUE_APP_BACKEND_BASE_URL}/guidedtour/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...apiClient.authHeader
        },
        body: JSON.stringify({ name: tour })
      }
    );

    return res.json();
  }
}

const service = new PlatformService();

export default service;
