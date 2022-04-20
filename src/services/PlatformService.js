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
  loadGuidedTours(accessToken) {
    return fetch(`${process.env.VUE_APP_BACKEND_BASE_URL}/guidedtour/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  completedTour(accessToken, tour) {
    return fetch(`${process.env.VUE_APP_BACKEND_BASE_URL}/guidedtour/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ name: tour })
    });
  }
}

const service = new PlatformService();

export default service;
