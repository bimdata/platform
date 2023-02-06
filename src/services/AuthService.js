import { User, UserManager, WebStorageStateStore } from "oidc-client";
import OIDC_CONFIG from "../config/oidc-config.js";

const userManager = new UserManager({
  ...OIDC_CONFIG,
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

/**
 * Monkey patch oidcUserManager to hijack login with force logout
 */
async function signinEndWithForcedLogout(url, args = {}) {
  // Let UserManager process signin response "as usual"
  const signinResponse = await this.processSigninResponse(url);

  const authorizedIdentityProviders = OIDC_CONFIG.authorizedIdentityProviders;

  if (authorizedIdentityProviders.length) {
    // Extract identity provider from signin response
    // Note: `profile.preferred_username` is of the following form: <IDENTITY_PROVIDER>.<USER_EMAIL>
    const identityProvider =
      signinResponse.profile.preferred_username.split(".")[0];

    if (!authorizedIdentityProviders.includes(identityProvider)) {
      // If the current identity provider is not authorized then logout
      // and set the post logout uri to the platform itself.
      // When the unauthenticated user comes back to the platform
      // a standard login flow will begin.
      const params = new URLSearchParams({
        post_logout_redirect_uri: OIDC_CONFIG.post_logout_redirect_uri,
        id_token_hint: signinResponse.id_token,
        // Prevent KeyCloak from logging out of the identity provider
        initiating_idp: identityProvider
      });
      const redirectUrl =
        OIDC_CONFIG.metadata.end_session_endpoint + "?" + params.toString();
      window.location.replace(redirectUrl);
      await new Promise(resolve => {
        // Wait for window.location.replace to trigger
        setTimeout(resolve, 5000);
      });
    }
  }

  const user = new User(signinResponse);

  if (args.current_sub) {
    if (args.current_sub !== user.profile.sub) {
      console.debug(
        "UserManager._signinEnd: current user does not match user returned from signin. sub from signin: ",
        user.profile.sub
      );
      throw new Error("login_required");
    } else {
      console.debug(
        "UserManager._signinEnd: current user matches user returned from signin"
      );
    }
  }
  await this.storeUser(user);

  this._events.load(user);
  return user;
}

// Override UserManager `_signinEnd` method with our custom implementation
signinEndWithForcedLogout.bind(userManager);
userManager._signinEnd = signinEndWithForcedLogout;

class AuthServive {
  getUser() {
    return userManager.getUser();
  }

  signIn(redirectPath) {
    return userManager.signinRedirect(
      redirectPath ? { state: redirectPath } : undefined
    );
  }

  signInSilent() {
    return userManager.signinSilent();
  }

  signInCallback() {
    return userManager.signinRedirectCallback();
  }

  signOut() {
    return userManager.signoutRedirect();
  }

  onUserLoaded(callback) {
    this._userLoadedCallback = callback;
    userManager.events.addUserLoaded(callback);
    userManager.events.addAccessTokenExpired(() => {
      console.log("Access token expired, reloading the platform...");
      location.reload();
    });
  }

  offUserLoaded() {
    userManager.events.removeUserLoaded(this._userLoadedCallback);
  }
}

const service = new AuthServive();

export default service;
