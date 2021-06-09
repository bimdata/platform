import { User, UserManager, WebStorageStateStore } from "oidc-client";
import { oidcConfig } from "@/config/oidcConfig";

const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

/*
Monkey patch oidcUserManager to hijack login with force logout
*/
async function signinEndWithForcedLogout (url, args = {}) {
  const signinResponse = await this.processSigninResponse(url);
  console.debug('UserManager._signinEnd: got signin response');
  const authorizedIdentityProviders = oidcConfig.authorizedIdentityProviders;
  if (authorizedIdentityProviders.length) {
    const identityProvider = signinResponse.profile.preferred_username.split('.')[0];
    if (!authorizedIdentityProviders.includes(identityProvider)) {
      const params = new URLSearchParams({
        post_logout_redirect_uri: oidcConfig.post_logout_redirect_uri,
        id_token_hint: signinResponse.id_token,
        initiating_idp: identityProvider,
      });
      const redirectUrl = oidcConfig.metadata.end_session_endpoint + '?' + params.toString();
      window.location.replace(redirectUrl);
      await new Promise((resolve, reject) => {
        // Wait for window.location.replace to trigger
        setTimeout(resolve, 5000);
      });
    }
  }

  const user = new User(signinResponse)

  if (args.current_sub) {
    if (args.current_sub !== user.profile.sub) {
      console.debug('UserManager._signinEnd: current user does not match user returned from signin. sub from signin: ', user.profile.sub)
      throw new Error('login_required')
    } else {
      console.debug('UserManager._signinEnd: current user matches user returned from signin')
    }
  }
  await this.storeUser(user)
  console.debug('UserManager._signinEnd: user stored')

  this._events.load(user)
  return user
}
signinEndWithForcedLogout.bind(userManager)

userManager._signinEnd = signinEndWithForcedLogout

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
  }

  offUserLoaded() {
    userManager.events.removeUserLoaded(this._userLoadedCallback);
  }
}

const service = new AuthServive();

export default service;
