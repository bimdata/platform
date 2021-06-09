import { reactive, readonly, toRefs, watchEffect } from "vue";
import apiClient from "@/server/api-client";
import AuthService from "@/server/AuthService";

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return {};
  }
}

const tokenExp = (token) => {
  if (token) {
    const parsed = parseJwt(token);
    return parsed.exp ? parsed.exp * 1000 : null;
  }
  return null;
}

const tokenIsExpired = (token) => {
  const tokenExpiryTime = tokenExp(token);
  if (tokenExpiryTime) {
    return tokenExpiryTime < new Date().getTime();
  }
  return false;
}

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
      if (tokenIsExpired(user.refresh_token)) {
        await AuthService.signIn(redirectPath);
        return;
      }
      // Refresh access token silently
      user = await AuthService.signInSilent();
    }
    // Keep access token up to date across refresh
    AuthService.onUserLoaded(user => (state.accessToken = user.access_token));
    // Set auth state
    state.isAuthenticated = true;
    state.accessToken = user.access_token;
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
