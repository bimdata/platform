import * as bimdataApiClient from "@bimdata/bimdata-api-client";

export default bimdataApiClient;
export const apiClient = bimdataApiClient;
export const bfcApiClient = new bimdataApiClient.BcfApi();
export const checkerApiClient = new bimdataApiClient.CheckerApi(); 
export const collaborationApiClient = new bimdataApiClient.CollaborationApi();
export const ifcApiClient = new bimdataApiClient.IfcApi();
export const ssoApiClient = new bimdataApiClient.SsoApi();
export const webHookApiClient = new bimdataApiClient.WebhookApi();

export function setupApiClient(accessToken) {
  // Get client instance
  const apiClientInstance = bimdataApiClient.ApiClient.instance;
  // Set instance base URL
  apiClientInstance.basePath = process.env.VUE_APP_BD_API_BASE_URL;
  // Set instance authorization
  const bearer = apiClientInstance.authentications.Bearer;
  bearer.type = 'oauth2';
  bearer.accessToken = accessToken;

  return bimdataApiClient;
};
