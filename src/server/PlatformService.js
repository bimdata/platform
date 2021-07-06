import apiClient from "./api-client";

class PlatformService {
  loginCallback() {
    return fetch(
      `${process.env.VUE_APP_BACKEND_BASE_URL}/create_or_update_user/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiClient.config.accessToken()
        }
      }
    );
  }
}

const service = new PlatformService();

export default service;
