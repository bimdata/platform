import { makeBIMDataApiClient } from '@bimdata/typescript-fetch-api-client';

const apiClient = makeBIMDataApiClient({
  apiUrl: process.env.VUE_APP_API_BASE_URL
});

export default apiClient;
