import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "@/services/api-client";
import AuthService from "@/services/AuthService";
import PlatformService from "@/services/PlatformService";
import { useUser } from "@/state/user.js";
import { tokenHasExpired } from "@/utils/auth";

const state = reactive({
  isAuthenticated: false,
  accessToken: null
});

const authenticate = async redirectPath => {
  let user = await AuthService.getUser();

  if (!user) {
    await AuthService.signIn(redirectPath);
    return;
  }

  if (!state.isAuthenticated) {
    if (user.expired) {
      // If refresh token has expired then sign in
      if (tokenHasExpired(user.refresh_token)) {
        await AuthService.signIn(redirectPath);
        return;
      }
      // Else refresh access token silently
      user = await AuthService.signInSilent();
    }

    // Keep access token up to date across refresh
    AuthService.onUserLoaded(user => (state.accessToken = user.access_token));

    // Set auth state
    state.isAuthenticated = true;
    state.accessToken = user.access_token;

    // Trigger login callback and check its status
    const { status: loginCallbackStatus } = await PlatformService.loginCallback(
      user.access_token
    );
    const { setIsNew } = useUser();
    setIsNew(loginCallbackStatus === 201);
  }
};

const signIn = async redirectPath => {
  await AuthService.signIn(redirectPath);
};

const signInCallback = async () => {
  const user = await AuthService.signInCallback();
  return user;
};

const signOut = async () => {
  await AuthService.signOut();
  AuthService.offUserLoaded();
  state.isAuthenticated = false;
  state.accessToken = null;
};

// Keep api client access token in sync with state
watchEffect(() => (apiClient.accessToken = state.accessToken));

export function useAuth() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    authenticate,
    signIn,
    signInCallback,
    signOut
  };
}
