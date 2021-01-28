import { UserManager, WebStorageStateStore } from 'oidc-client';
import { oidcConfig } from '@/config/oidcConfig';

const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

class UserServive {
  
  getUser() {
    return userManager.getUser();
  }

  signIn(redirectPath) {
    return userManager.signinRedirect(
      redirectPath ? { state: redirectPath } : undefined
    );
  }

  signInCallback() {
    return userManager.signinRedirectCallback();
  }

  signOut() {
    return userManager.signoutRedirect();
  }

}

const service = new UserServive();

export default service;
