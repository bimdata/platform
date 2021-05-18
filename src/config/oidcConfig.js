/**
 * OIDC Client Configuration
 * See: https://github.com/IdentityModel/oidc-client-js/wiki#configuration
 */

const APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const AUTHORITY = `${process.env.VUE_APP_IAM_BASE_URL}/auth/realms/bimdata`;
const OIDC_ENDPOINT = `${AUTHORITY}/protocol/openid-connect`;
const CLIENT_ID = process.env.VUE_APP_OIDC_CLIENT_ID;

export const oidcConfig = {
  // Auth request config
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  scope: "openid profile email",
  response_type: "code",
  redirect_uri: `${APP_BASE_URL}/oidc-callback`,
  extraQueryParams: {
    kc_idp_hint: "bimdataconnect"
  },

  // Logout config
  post_logout_redirect_uri: APP_BASE_URL,
  revokeAccessTokenOnSignout: true,

  // Enable access token refresh
  automaticSilentRenew: true,

  // Other options
  clockSkew: 900,

  // Auth metadata
  metadata: {
    issuer: AUTHORITY,
    authorization_endpoint: `${OIDC_ENDPOINT}/auth`,
    token_endpoint: `${OIDC_ENDPOINT}/token`,
    userinfo_endpoint: `${OIDC_ENDPOINT}/userinfo`,
    end_session_endpoint: `${OIDC_ENDPOINT}/logout`,
    jwks_uri: `${OIDC_ENDPOINT}/certs`
  }
};
