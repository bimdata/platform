import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";

const apiClient = makeBIMDataApiClient({
  apiUrl: process.env.VUE_APP_API_BASE_URL
});

const privateApiFetch = async ({ method = "GET", path, body }) => {
  const response = await fetch(
    `${process.env.VUE_APP_API_BASE_URL}/private${path}`,
    {
      method,
      headers: {
        Authorization: apiClient.config.accessToken()
      },
      body: body ? JSON.stringify(body) : undefined
    }
  );
  return await response.json();
};

const privateApiClient = {
  get(path) {
    return privateApiFetch({ path });
  },
  post(path, body) {
    return privateApiFetch({ method: "POST", path, body });
  },
  patch(path, body) {
    return privateApiFetch({ method: "PATCH", path, body });
  },
  delete(path) {
    return privateApiFetch({ method: "DELETE", path });
  }
};

export default apiClient;

export { privateApiClient };
