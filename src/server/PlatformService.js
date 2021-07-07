class PlatformService {
  loginCallback(accessToken) {
    return fetch(
      `${process.env.VUE_APP_BACKEND_BASE_URL}/create_or_update_user/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  }
}

const service = new PlatformService();

export default service;
