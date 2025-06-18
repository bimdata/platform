import { makeBIMDataApiClient } from "@bimdata/typescript-fetch-api-client";

function createClient(name, url, getHeaders, { credentials } = {}) {
  /**
   * Trigger an HTTP request to `url` using JS fetch API.
   * You can customize the request with the following parameters:
   *  - `method`: (Optional) HTTP method, default to 'GET'
   *  - `path`: (Mandatory) API endpoint (should start with '/')
   *  - `body`: (Optional) request body (its format is assumed to be JSON by default)
   *  - `json`: (Optional) a boolean that tell whether body should be treated as JSON, default to true
   *
   * @param {*} params request parameters
   * @returns {Promise}
   */
  const _fetch = async ({ method = "GET", path, body, json = true }) => {
    const response = await fetch(`${url}${path}`, {
      method,
      credentials,
      headers: {
        ...getHeaders(),
        ...(json ? { "Content-Type": "application/json;charset=UTF-8" } : {})
      },
      body: body ? (json ? JSON.stringify(body) : body) : undefined
    });
    if (!response.ok) {
      let errorDetails = "";
      if (response.headers.get("Content-Type") === "application/json") {
        errorDetails = await response.text();
      }
      throw new Error(
        `[${name}] Request error ${response.status}: ${errorDetails}`
      );
    }
    if (response.status === 204) {
      // Do not try to parse response body in case
      // of HTTP status "204 No Content"
      return;
    }
    return await response.json();
  };

  return {
    get(path) {
      return _fetch({ path });
    },
    post(path, body, { json } = {}) {
      return _fetch({ method: "POST", path, body, json });
    },
    patch(path, body, { json } = {}) {
      return _fetch({ method: "PATCH", path, body, json });
    },
    put(path, body, { json } = {}) {
      return _fetch({ method: "PUT", path, body, json });
    },
    delete(path) {
      return _fetch({ method: "DELETE", path });
    }
  };
}

const apiClient = makeBIMDataApiClient({
  apiUrl: ENV.VUE_APP_API_BASE_URL,
  credentials: "include"
});

const privateApiClient = createClient(
  "Private API Client",
  `${ENV.VUE_APP_API_BASE_URL}/private`,
  () => apiClient.authHeader,
  { credentials: "include" }
);

const backendClient = createClient(
  "Backend Client",
  `${ENV.VUE_APP_BACKEND_BASE_URL}`,
  () => apiClient.authHeader
);

export default apiClient;

export { apiClient, privateApiClient, backendClient };
