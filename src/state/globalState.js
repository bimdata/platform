import { UserManager, WebStorageStateStore } from 'oidc-client';
import { reactive, toRefs, watch } from 'vue';
import { setupApiClient } from '@/api';
import { oidcConfig } from '@/config/oidcConfig';

const state = reactive({
  isAuthenticated: false,
  loading: false,
  user: null
});

const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.localStorage })
});

const authenticate = async (redirectPath) => {
  const user = await getUser();
  if (user) {
    state.isAuthenticated = true;
    state.user = user;
  } else {
    await signIn(redirectPath)
  }
};

const getUser = () => userManager.getUser();

const signIn = (redirectPath) => userManager.signinRedirect(redirectPath ? { state: redirectPath } : undefined);

const signInCallback = () => userManager.signinRedirectCallback();

const signOut = () => userManager.signoutRedirect();

watch(() => state.user && setupApiClient(state.user.access_token));

export function useGlobalState() {
  return {
    ...toRefs(state),
    authenticate,
    signIn,
    signInCallback,
    signOut
  };
}
