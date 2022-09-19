import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";

const apiClient = makeBIMDataApiClient({
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include"
});

/**
 * Trigger an HTTP request to private API using JS fetch API.
 * You can customize the request with the following parameters:
 *  - `method`: (Optional) HTTP method, default to 'GET'
 *  - `path`: (Mandatory) API endpoint (should start with '/')
 *  - `body`: (Optional) request body (its format is assumed to be JSON by default)
 *  - `json`: (Optional) a boolean that tell whether body should be treated as JSON, default to true
 *
 * @param {*} params request parameters
 * @returns {Promise}
 */
const privateApiFetch = async ({ method = "GET", path, body, json = true }) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/private${path}`,
    {
      method,
      credentials: "include",
      headers: {
        ...apiClient.authHeader,
        ...(json ? { "Content-Type": "application/json;charset=UTF-8" } : {})
      },
      body: body ? (json ? JSON.stringify(body) : body) : undefined
    }
  );
  if (!response.ok) {
    let errorDetails = "";
    if (response.headers.get("Content-Type") === "application/json") {
      errorDetails = await response.text();
    }
    throw new Error(
      `[Private API Client] Request error ${response.status}: ${errorDetails}`
    );
  }
  if (response.status === 204) {
    // Do not try to parse response body in case
    // of HTTP status "204 No Content"
    return;
  }
  return await response.json();
};

const privateApiClient = {
  get(path) {
    return privateApiFetch({ path });
  },
  post(path, body, { json } = {}) {
    return privateApiFetch({ method: "POST", path, body, json });
  },
  patch(path, body, { json } = {}) {
    return privateApiFetch({ method: "PATCH", path, body, json });
  },
  delete(path) {
    return privateApiFetch({ method: "DELETE", path });
  }
};

export default apiClient;

export { apiClient, privateApiClient };
