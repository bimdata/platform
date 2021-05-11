/* This file is part of the BIMData Platform package.
(c) BIMData support@bimdata.io
For the full copyright and license information, please view the LICENSE
file that was distributed with this source code. */

const APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const AUTHORITY = `${process.env.VUE_APP_IAM_BASE_URL}/auth/realms/bimdata`;
const OIDC_ENDPOINT = `${AUTHORITY}/protocol/openid-connect`;
const CLIENT_ID = process.env.VUE_APP_OIDC_CLIENT_ID;

export const oidcConfig = {
  authority: AUTHORITY,
  response_type: "code",
  client_id: CLIENT_ID,
  redirect_uri: `${APP_BASE_URL}/oidc-callback`,
  scope: "openid profile email",
  post_logout_redirect_uri: APP_BASE_URL,
  extraQueryParams: {
    kc_idp_hint: "bimdataconnect"
  },
  automaticSilentRenew: true,
  revokeAccessTokenOnSignout: true,
  clockSkew: 900,
  metadata: {
    issuer: AUTHORITY,
    authorization_endpoint: `${OIDC_ENDPOINT}/auth`,
    token_endpoint: `${OIDC_ENDPOINT}/token`,
    userinfo_endpoint: `${OIDC_ENDPOINT}/userinfo`,
    end_session_endpoint: `${OIDC_ENDPOINT}/logout`,
    jwks_uri: `${OIDC_ENDPOINT}/certs`
  }
};
