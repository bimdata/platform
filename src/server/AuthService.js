import { UserManager, WebStorageStateStore } from "oidc-client";
import { oidcConfig } from "@/config/oidcConfig";

const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

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
