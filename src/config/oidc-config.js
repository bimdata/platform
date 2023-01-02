const APP_BASE_URL = ENV.VUE_APP_BASE_URL;
const AUTHORITY = `${ENV.VUE_APP_IAM_BASE_URL}/auth/realms/bimdata`;

const CLIENT_ID = ENV.VUE_APP_OIDC_CLIENT_ID;
const AUTHORIZED_IDENTITY_PROVIDERS = ENV.VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS;

/**
 * OIDC Client Configuration
 * See: https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html
 *
 * @type {import("oidc-client-ts").UserManagerSettings}
 */
const config = {
  // Auth request config
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  scope: "openid profile email",
  response_type: "code",
  redirect_uri: `${APP_BASE_URL}/oidc-callback`,

  // Logout config
  post_logout_redirect_uri: APP_BASE_URL,

  // Enable access token refresh
  automaticSilentRenew: true,

  // Auth metadata
  metadataUrl: `${AUTHORITY}/.well-known/openid-configuration`,

  // Limit authorized identity providers (custom)
  authorizedIdentityProviders: AUTHORIZED_IDENTITY_PROVIDERS?.split(",") ?? []
};

if (AUTHORIZED_IDENTITY_PROVIDERS) {
  config.extraQueryParams = {
    kc_idp_hint: AUTHORIZED_IDENTITY_PROVIDERS
  };
}

export default config;
